// TODO!! write basic tests
const sanitizeHtml = require("sanitize-html");
const { response } = require("express");

const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.SBASE_USER,
  host: process.env.SBASE_HOST,
  database: process.env.SBASE_DB,
  password: process.env.SBASE_PW,
  port: process.env.SBASE_PORT,
});

const getStudents = (req, res) => {
  pool.query("SELECT * FROM students", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const getStudentById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("SELECT * FROM students WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const createStudent = (req, res) => {
  const { first_name, last_name, email, date_started } = req.body;
  const sanitized_first_name = sanitizeHtml(first_name);
  const sanitized_last_name = sanitizeHtml(last_name);
  pool.query(
    "INSERT INTO students ( first_name, last_name, email, date_started) VALUES ($1, $2, $3, $4) RETURNING *",
    [sanitized_first_name, sanitized_last_name, email, date_started],
    (error, results) => {
      if (error) {
        throw error;
      }
      return res.status(201).json(results.rows[0]);
    }
  );
};

const updateStudent = (req, res) => {
  if (req.body.id) {
    const values = [
      req.body.id,
      //   sanitizeHtml(req.body.first_name),
      //   sanitizeHtml(req.body.last_name),
      req.body.first_name,
      req.body.last_name,
      req.body.email,
      req.body.date_started,
    ];
    pool.query(
      "UPDATE students SET first_name = $2, last_name = $3, email = $4, date_started = $5 WHERE id = $1",
      values,
      (error, results) => {
        if (error) {
          console.log(error);
          throw error;
        }
        // send back whatever you want your app to consume
        // return res.status(201).send({values});
        return res.status(201).send({
          id: values[0],
          first_name: values[1],
          last_name: values[2],
          email: values[3],
          date_started: values[4],
        });
      }
    );
  }
};

const deleteStudent = (req, res) => {
  const id = req.params.id;
  pool.query(`DELETE FROM students WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }
    // send back whatever you want your app to consume
    return res.status(200).send(id);
  });
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  deleteStudent,
  updateStudent,
};
