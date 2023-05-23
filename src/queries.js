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

/*
  date_started: string;
  active: boolean;
  phone_1?: string;
  phone_2?: string;
  phone_1_label?: string;
  phone_2_label?: string;
  financial_status?: string;
  lesson_length?: string;
  current_rate?: string;
  active_songs?: string;
  additional_notes?: string;
*/

const createStudent = (req, res) => {
  const {
    first_name,
    last_name,
    email,
    date_started,
    active,
    phone_1,
    phone_2,
    phone_1_label,
    phone_2_label,
    financial_status,
    lesson_length,
    current_rate,
    active_songs,
    additional_notes,
  } = req.body;

  const sanitized_first_name = first_name;
  const sanitized_last_name = last_name;

  pool.query(
    `INSERT INTO students ( first_name, last_name, email, date_started, active, phone_1, phone_2, phone_1_label, phone_2_label,
      financial_status, lesson_length, current_rate, active_songs, additional_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
    [
      sanitized_first_name,
      sanitized_last_name,
      email,
      date_started,
      active,
      phone_1,
      phone_2,
      phone_1_label,
      phone_2_label,
      financial_status,
      lesson_length,
      current_rate,
      active_songs,
      additional_notes,
    ],
    (error, results) => {
      if (error) {
        // TODO! Figure out path of error!
        console.log("opps error!");
        // console.log(error);
        res.status(500).send(error.detail);
        // throw error;
        throw new Error(error);
      }
      console.log(results.rows[0]);
      return res.status(201).json(results.rows[0]);
    }
  );
  //   const sanitized_first_name = sanitizeHtml(first_name);
  //   const sanitized_last_name = sanitizeHtml(last_name);
  //   if (first_name === "" || last_name === "" || date_started === "") {
  //     throw new Error("You are missing parameters!", { status: 400 });
  //   }
};

const updateStudent = (req, res) => {
  if (req.body.id) {
    const values = [
      req.body.id,
      sanitizeHtml(req.body.first_name),
      sanitizeHtml(req.body.last_name),
      // req.body.first_name,
      // req.body.last_name,
      req.body.email,
      req.body.date_started,
      req.body.active,
      req.body.phone_1,
      req.body.phone_2,
      req.body.phone_1_label,
      req.body.phone_2_label,
      req.body.financial_status,
      req.body.lesson_length,
      req.body.current_rate,
      req.body.active_songs,
      req.body.additional_notes,
    ];
    pool.query(
      "UPDATE students SET first_name = $2, last_name = $3, email = $4, date_started = $5, active = $6, phone_1 = $7, phone_2 = $8, phone_1_label = $9, phone_2_label = $10, financial_status = $11,lesson_length = $12, current_rate = $13,active_songs = $14, additional_notes = $15 WHERE id = $1",
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
          active: values[5],
          phone_1: values[6],
          phone_2: values[7],
          phone_1_label: values[8],
          phone_2_label: values[9],
          financial_status: values[10],
          lesson_length: values[11],
          current_rate: values[12],
          active_songs: values[13],
          additional_notes: values[14],
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
