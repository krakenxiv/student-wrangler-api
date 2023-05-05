require("dotenv").config();
const express = require("express");
const db = require("./queries");
const cors = require("cors");
const bodyParser = require("body-parser");
const { response } = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const port = 3020;
app.use(helmet());
app.use(bodyParser.json());
app.use(morgan("combined"));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
const corsOptions = {
  origin: [process.env.TODO_UI_LOCAL_HOST, process.env.TODO_DATA_HOST],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json({ app: "Student Wrangler App" });
});

app.get("/students", db.getStudents);
app.get("/students/:id", db.getStudentById);
app.post("/students", db.createStudent);
app.delete("/students/:id", db.deleteStudent);
app.put("/students", db.updateStudent);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
