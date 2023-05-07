const express = require("express");
const app = express();
const port = 3000;
const Pool = require("pg").Pool;

const pool = new Pool({
  user: "ukd_student",
  host: "8.tcp.ngrok.io.",
  database: "ukd_db",
  password: "password",
  port: 12611,
});

// TASK 0

const getUsers = (req, res) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

// TASK 1

const createStudents = async (req, res) => {
  pool.query(
    `CREATE TABLE Oleniak Serhii" (
      id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    age INTEGER
    );`
  );
  const { first_name, last_name, age } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO students (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *",
      [first_name, last_name, age]
    );
    const student = result.rows[0];
    res.json(student);
    client.release();
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getStudentsAll = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM students");
    const students = result.rows;
    res.json(students);
    client.release();
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// TASK 2
const getStudentsSortedASC = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students ORDER BY age ASC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const getStudentsSortedDESC = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM students ORDER BY age DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving students from database");
  }
};

app.get("/users", getUsers);
app.post("/students", createStudents);
app.get("/students", getStudentsAll);
app.get("/students/sortedASC", getStudentsSortedASC);
app.get("/students/sortedDESC", getStudentsSortedDESC);

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
