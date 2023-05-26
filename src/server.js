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
  origin: [process.env.SW_LOCAL_HOST, process.env.SW_PROD_HOST],
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

// Error handling Middleware function for logging the error message
const errorLogger = (error, request, response, next) => {
  console.log(`errorLogger ${error.message}`);
  console.log(`errorLogger ${error.status}`);
  next(error); // calling next middleware
};

// Error handling Middleware function reads the error message
// and sends back a response in JSON format
const errorResponder = (error, request, response, next) => {
  response.header("Content-Type", "application/json");

  const status = error.status || 400;
  console.log("errorResponder");
  console.log(error.status);
  console.log(error.message);
  response.status(status).send(error.message);
};

// Fallback Middleware function for returning
// 404 error for undefined paths
const invalidPathHandler = (request, response, next) => {
  console.log("invalidPathHandler");
  response.status(404);
  response.send("invalid path");
};

// Attach the first Error handling Middleware
// function defined above (which logs the error)
// app.use(errorLogger);

// // Attach the second Error handling Middleware
// // function defined above (which sends back the response)
// app.use(errorResponder);

// Attach the fallback Middleware
// function which sends back the response for invalid paths)
app.use(invalidPathHandler);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
