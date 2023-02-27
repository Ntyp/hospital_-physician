const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const moment = require("moment");
const app = express();
const cors = require("cors");
const jsonParser = bodyParser.json();
const port = 7000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "banpho",
});

app.use(cors());

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
  const place = req.body.place;

  connection.query(
    "INSERT INTO users (user_username,user_password,user_firstname,user_lastname,user_position,user_role,user_place) VALUES (?,?,?,?,?,?,?)",
    [username, password, firstname, lastname, position, role, place],
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

// ระบบติดตามอุปกรณ์
app.get("/tracking/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]];

  connection.query(
    "SELECT * FROM tracking WHERE user_id = ?",
    [id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok", data: results });
    }
  );
});

// สำหรับเช็คตอนกดดวงตา detail
app.get("/tracking-data/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]];

  connection.query(
    "SELECT * FROM tracking WHERE group_id = ?",
    [id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok", data: results });
    }
  );
});

// นำ item ในกลุ่ม track
app.get("/tracking-item/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]];

  connection.query(
    "SELECT * FROM product WHERE track_id = ?",
    [id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok", data: results });
    }
  );
});

// สร้าง tracking
app.post("/create-tracking", jsonParser, (req, res) => {
  const id = req.body.id; // trackid
  const items = req.body.items; // สินค้าที่ส่งไป
  const count = req.body.count; // จำนวน
  const sender = req.body.sender; // ชื่อผู้ส่ง
  const place = req.body.place; //โรงพยาบาลสต.ที่ส่งมา
  const date = req.body.date; // วันที่ส่ง
  const user_id = req.body.user_id; // ไอดีผู้ที่ทำ
  const updated_at = moment().format("YYYY-MM-DD HH:mm:ss"); // อัปเดตวันที่กระทำล่าสุด

  // เพิ่มข้อมูลเข้า tracking
  connection.query(
    "INSERT INTO tracking (group_id,tracking_hospital,tracking_sender,date_at,tracking_status,user_id) VALUES (?,?,?,?,?,?)",
    [id, place, sender, date, "จัดส่งอุปกรณ์และเครื่องมือ", user_id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      return;
    }
  );

  // สร้างกลุ่มสินค้าที่ส่งไป
  connection.query(
    "INSERT INTO group_product (track_id,group_sender,group_status,date_at,user_id) VALUES (?,?,?,?,?)",
    [id, sender, "จัดส่งอุปกรณ์และเครื่องมือ", date, user_id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      // Loop ค่าของสินค้าที่ส่งไปบันทึก
      for (let i = 0; i < count; i++) {
        let name = items[i].name;
        let quantity = items[i].quantity;
        connection.query(
          "INSERT INTO product (product_name,product_count,track_id) VALUES (?,?,?)",
          [name, quantity, id],
          function (err, results) {
            if (err) {
              res.json({ status: "error", message: err });
              return;
            }
            return;
          }
        );
      }
      res.json({ status: "ok" });
    }
  );
});

// อัปเดตสถานะอุปกรณ์และนัดวันรับสินค้า
app.put("/tracking/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]]; // group_id ที่ส่งไป
  const tracking_recipient = req.body.recipient;
  const tracking_meet = req.body.date; // วันนัดรับ
  connection.query(
    "UPDATE tracking SET tracking_recipient = ?, tracking_meet_date = ?,tracking_status = ? WHERE group_id = ?",
    [tracking_recipient, tracking_meet, "รับสินค้าเรียบร้อย", id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

// อัปเดตเมื่อได้รับสินค้ากลับ
app.put("/tracking-back/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]]; // group_id ที่ส่งไป
  connection.query(
    "UPDATE tracking SET tracking_status = ? WHERE group_id = ?",
    ["เสร็จสิ้น", id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

// อัปเดตสถานะอุปกรณ์สิ้นสุด
app.put("/trackingfinish/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]];
  const tracking_status = req.body.tracking_status;

  connection.query(
    "UPDATE tracking SET tracking_status = ? WHERE tracking_id = ?",
    [tracking_status, id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

// คำร้องเบิกเงิน
app.get("/documents/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]];

  connection.query(
    "SELECT * FROM documents WHERE user_id = ?",
    [id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok", data: results });
    }
  );
});

// สร้างคำร้องเบิกเงิน
app.post("/document", jsonParser, (req, res) => {
  const name = req.body.name;
  const topic = req.body.topic;
  const detail = req.body.detail;
  const file = req.body.file;
  const user_id = req.body.user_id;
  const time = moment().format("YYYY-MM-DD hh:mm:ss");
  connection.query(
    "INSERT INTO documents (document_topic,document_detail,document_file,document_owner,document_version,document_status,user_id,created_at) VALUES (?,?,?,?,?,?,?,?)",
    [topic, detail, file, name, 1, "ยื่นคำร้อง", user_id, time],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

// แก้ไขคำร้อง

// ลบคำร้อง
app.delete("/document/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]];
  connection.query(
    "DELETE FROM documents WHERE document_id = ?",
    [id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});
