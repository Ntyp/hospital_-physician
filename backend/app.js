const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const app = express();
const jsonParser = bodyParser.json();
const port = 7000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "banpho",
});

app.get("/", (req, res) => {
  res.send("Banpho");
});

// เรียกดูข้อมูล user ทั้งหมด
app.get("/users", jsonParser, (req, res) => {
  connection.query("SELECT * FROM users ", function (err, results) {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    }
    res.json(results);
  });
});

// สมัครสมาชิก
app.post("/register", jsonParser, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const position = req.body.position;
  const role = req.body.role;

  connection.query(
    "INSERT INTO users (user_username,user_password,user_firstname,user_lastname,user_position,user_role) VALUES (?,?,?,?,?,?)",
    [username, password, firstname, lastname, position, role],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

// ล็อกอิน
app.post("/login", jsonParser, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  connection.query(
    "SELECT * FROM users WHERE user_username = ? AND user_password = ?",
    [username, password],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok", data: results });
    }
  );
});

app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});
