var express = require("express");
var app = express();
var fs = require("fs");
app.set("port", process.env.PORT || 3000);

app.use(express.json()); // vvimp to add the body parser

let students = {};
let lastStudentKeyNumber = 0;
const readFile = () => {
  students = JSON.parse(fs.readFileSync("./Students.json", "utf-8"));
};



readFile();

const findLastStudentKey = () => {
  for (key of Object.keys(students)) {
    const number = key.split("-")[1];
    lastStudentKeyNumber = Math.max(lastStudentKeyNumber, number);
  }
};
findLastStudentKey();

// or else you can hard code the lastStudentKeyNumber = 5;

// console.log(lastStudentKeyNumber);

const saveChanges = () => {
  fs.writeFileSync("./Students.json", JSON.stringify(students));
};

app.get("/listStudents", (req, res) => {
  return res.status(200).send(JSON.stringify(students));
});

app.get("/showStudent/:id", (req, res) => {
  const { id } = req.params;
  const key = `student-${id}`;
  if (key in students) {
    return res.status(200).send(JSON.stringify(students[key]));
  }
  return res.send("User not found");
});

app.post("/addStudent", (req, res) => {
  // ik validation is must but, considering the time constraint.
  const lastKey = `student-${lastStudentKeyNumber}`;
  const newStudentId = students[lastKey].id + 1;
  const newStudent = {
    id: newStudentId,
    ...req.body,
  };
  lastStudentKeyNumber++;
  const newKey = `student-${lastStudentKeyNumber}`;
  students[newKey] = newStudent;
  saveChanges();
  return res.send("Student added");
});

app.listen(app.get("port"), () => console.log("server is up"));
