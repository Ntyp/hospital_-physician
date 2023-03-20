const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const moment = require("moment");
const iconv = require("iconv-lite");
const { Buffer } = require("buffer");
const path = require("path");
const app = express();
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fileUpload = require("express-fileupload");
const jsonParser = bodyParser.json();
const port = 7000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "banpho",
});

// app.use(cors());
// app.use(express.static("public"));
// app.use(fileUpload());

app.use(cors());
app.use(
  fileUpload({
    defCharset: "utf8",
    defParamCharset: "utf8",
  })
);
app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get("/hospital", jsonParser, (req, res) => {
  connection.query("SELECT * FROM hospital ", function (err, results) {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    }
    res.json(results);
  });
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
        return res.json({ status: "error", message: err });
      }
      if (results.length == 0) {
        return res.json({ status: "error", message: "User not found" });
      }
      return res.json({ status: "ok", data: results });
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
    "SELECT * FROM tracking INNER WHERE group_id = ?",
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

// เช็คอุปกรณ์ที่อยู่ใน group ว่ามีอะไรบ้าง
app.get("/tracking-item/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]]; // group_id

  connection.query(
    "SELECT * FROM equipment WHERE group_id = ?",
    [id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok", data: results });
      return;
    }
  );
});

// สร้าง tracking
app.post("/create-tracking", jsonParser, (req, res) => {
  const id = req.body.id; // trackid
  const items = req.body.items; // สินค้าที่ส่งไป
  const quantity = req.body.count; // จำนวน
  const sender = req.body.sender; // ชื่อผู้ส่ง
  const place = req.body.place; //โรงพยาบาลสต.ที่ส่งมา
  const date = req.body.date; // วันที่ส่ง
  const user_id = req.body.user_id; // ไอดีผู้ที่ทำ
  const hospital_id = req.body.hospital; // ไอดีโรงพยาบาล
  const updated_at = moment().format("YYYY-MM-DD HH:mm:ss"); // อัปเดตวันที่กระทำล่าสุด

  // เพิ่มข้อมูลเข้า tracking
  connection.query(
    "INSERT INTO tracking (group_id,tracking_hospital,tracking_sender,date_at,tracking_status,user_id,hospital_id) VALUES (?,?,?,?,?,?,?)",
    [
      id,
      place,
      sender,
      date,
      "จัดส่งอุปกรณ์และเครื่องมือ",
      user_id,
      hospital_id,
    ],
    function (err, results) {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: err, message: "Error creating tracking record" });
        return;
      }

      // Loop ค่าของสินค้าที่ส่งไปบันทึก
      for (let i = 0; i < quantity; i++) {
        let name = items[i].name;
        let quantity = items[i].quantity;
        connection.query(
          "INSERT INTO equipment (equipment_name,equipment_quantity,group_id) VALUES (?,?,?)",
          [name, quantity, id],
          function (err, results) {
            if (err) {
              console.error(err);
              res.status(500).json({
                error: err,
                message: "Error creating equipment record",
              });
              return;
            }
          }
        );
      }
      res.json({ status: "ok" });
    }
  );
});

// เช็คจำนวนแต่ละสถานะ
app.get("/tracking-status/:id/:status", jsonParser, (req, res) => {
  const id = [req.params["id"]]; //รหัสโรงพยาบาล
  const status = [req.params["status"]]; //สถานะ

  if (status == "all") {
    connection.query(
      "SELECT COUNT(tracking_id) as count FROM tracking WHERE hospital_id = ? ",
      [id],
      function (err, results) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        res.json({ status: "ok", data: results });
      }
    );
  } else {
    connection.query(
      "SELECT COUNT(tracking_id) as count FROM tracking WHERE hospital_id = ? AND tracking_status = ?",
      [id, status],
      function (err, results) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        res.json({ status: "ok", data: results });
      }
    );
  }
});

// อัปเดตสถานะอุปกรณ์และนัดวันรับสินค้า
app.put("/tracking/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]]; // group_id ที่ส่งไป
  const tracking_recipient = req.body.recipient;
  const tracking_meet = req.body.date; // วันนัดรับ
  if (tracking_meet) {
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
  } else {
    connection.query(
      "UPDATE tracking SET tracking_recipient = ?,tracking_status = ? WHERE group_id = ?",
      [tracking_recipient, "รอระบุวันนัดรับ", id],
      function (err, results) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        res.json({ status: "ok" });
      }
    );
  }
});

app.put("/tracking-date/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]]; // group_id ที่ส่งไป
  const tracking_meet = req.body.date; // วันนัดรับ
  connection.query(
    "UPDATE tracking SET tracking_meet_date = ?,tracking_status = ? WHERE group_id = ?",
    [tracking_meet, "รับอุปกรณ์เรียบร้อย", id],
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

// ==============================================
// ============== ระบบ Document ==================
// ==============================================

// สร้างคำร้อง
// app.post("/document-disapprove", jsonParser, (req, res) => {
//   const title = req.body.title;
//   const detail = req.body.detail;
//   const file = req.body.file;
//   const version = 1;
//   const status = "ดำเนินการ";
//   const hospital = req.body.hospital;
//   const created_at = moment().format("YYYY-MM-DD hh:mm:ss");
//   const created_by = req.body.user_id;
//   connection.query(
//     "INSERT INTO document (document_title,document_description,document_file,document_version,document_status,hospital_name,created_at,created_by) VALUES (?,?,?,?,?,?,?,?)",
//     [
//       title,
//       description,
//       file,
//       version,
//       status,
//       hospital,
//       created_at,
//       created_by,
//     ],
//     function (err, results) {
//       if (err) {
//         res.json({ status: "error", message: err });
//         return;
//       }
//       res.json({ status: "ok" });
//     }
//   );
// });

// สร้างคำร้อง
app.post("/document", jsonParser, (req, res) => {
  const code = req.body.code;
  const title = req.body.title;
  const detail = req.body.detail;
  const file = req.body.file;
  const file_path = req.body.filePath;
  const version = 1;
  const status = 1;
  const hospital = req.body.hospital;
  const created_at = moment().format("YYYY-MM-DD hh:mm:ss");
  const created_by = req.body.name;

  connection.query(
    "INSERT INTO document (document_code,document_title,document_detail,document_file,document_file_path,document_version,document_status,created_at,hospital_id,created_by) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [
      code,
      title,
      detail,
      file,
      file_path,
      version,
      status,
      created_at,
      hospital,
      created_by,
    ],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

// คำร้องเบิกเงินของแต่ละโรงพยาบาล
// หน้าคำร้องทั้งหมดของเจ้าหน้าที่โรงพยาบาล
app.get("/documents/:id", jsonParser, (req, res) => {
  const hospital_id = [req.params["id"]]; // hospital id

  connection.query(
    "SELECT * FROM document WHERE hospital_id = ?",
    [hospital_id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok", data: results });
    }
  );
});

// เช็ครายละเอียดคำร้องเบิกเงินของแต่ละโรงพยาบาล
// ดูรายละเอียด
app.get("/document-detail/:id", jsonParser, (req, res) => {
  const document_id = [req.params["id"]]; // hospital id

  connection.query(
    "SELECT * FROM document WHERE document_id = ?",
    [document_id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok", data: results });
    }
  );
});

// เช็คสถานะของแต่ละตำแหน่งผู้อนุมัติ
// localhost:7000/documents-status/10/2
// #10 คือ hospital_id 2 คือ role_id
app.get("/documents-status/:id/:status", jsonParser, (req, res) => {
  const hospital_id = [req.params["id"]];
  const status = req.params["status"];

  if (hospital_id != 17) {
    connection.query(
      "SELECT * FROM document WHERE hospital_id = ? AND document_status = ?",
      [hospital_id, status],
      function (err, results) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        res.json({ status: "ok", data: results });
      }
    );
  } else {
    connection.query(
      "SELECT * FROM document WHERE document_status = ?",
      [status],
      function (err, results) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        res.json({ status: "ok", data: results });
      }
    );
  }
});

// สถานะที่รออนุมัติ
app.get("/documents-waiting/:id/:status", jsonParser, (req, res) => {
  const hospital_id = [req.params["id"]];

  // ไม่ใช่สาธารณสุข
  if (hospital_id != 17) {
  } else {
  }
  const status = req.params["status"];

  if (hospital_id != 17) {
  }
  connection.query(
    "SELECT * FROM document WHERE hospital_id = ? AND document_status = ?",
    [hospital_id, status],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok", data: results });
    }
  );
});

app.get("/documents-approve/:id/:status", jsonParser, (req, res) => {
  const hospital_id = [req.params["id"]];
  const approval_status = req.params["status"]; // role ของคนที่จะเช็ค
  const status_approve = "อนุมัติ";

  if (hospital_id != 17) {
    connection.query(
      "SELECT * FROM document INNER JOIN approval ON document.document_code = approval.document_code WHERE hospital_id = ? AND document_status = ?",
      [hospital_id, status],
      function (err, results) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        res.json({ status: "ok", data: results });
      }
    );
  } else {
    connection.query(
      "SELECT * FROM document INNER JOIN approval ON document.document_id = approval.document_id WHERE approve_" +
        approval_status +
        "= ? ",
      [status_approve],
      function (err, results) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        res.json({ status: "ok", data: results });
      }
    );
  }
});

// ประวัติการอนุมัติ
// approver_id ,approval_status
app.get("/documents-disapprove/:id/:status", jsonParser, (req, res) => {
  const hospital_id = [req.params["id"]]; // รหัสเอกสาร
  const approval_status = req.params["status"]; // role ของคนที่จะเช็ค
  const status_disapprove = "ไม่อนุมัติ";

  if (hospital_id != 17) {
    connection.query(
      "SELECT * FROM document INNER JOIN approval ON document.document_code = approval.document_code WHERE hospital_id = ? AND document_status = ?",
      [hospital_id, status],
      function (err, results) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        res.json({ status: "ok", data: results });
      }
    );
  } else {
    connection.query(
      "SELECT * FROM document INNER JOIN approval ON document.document_code = approval.document_code WHERE approve_" +
        approval_status +
        "= ? ",
      [status_disapprove],
      function (err, results) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        res.json({ status: "ok", data: results });
      }
    );
  }
});

// อนุมัติเอกสาร
// id = id เอกสาร
app.post("/approve/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]]; //code
  const role = req.body.role;
  const comment = req.body.comment;
  const hospital = req.body.hospital;
  let status = 1; // อนุมัติ
  let update_status = role + 1; // ปรับสถานะส่งให้ตำแหน่งอื่น

  // ต้องมีการแจ้งเตือนไปที่ตำแหน่งถัดไป
  connection.query(
    "INSERT INTO approval (document_code,approver_id,approval_status,approval_comments,approval_hospital) VALUES (?,?,?,?,?)",
    [id, role, status, comment, hospital],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      connection.query(
        "UPDATE document SET document_status = ?, approve_" +
          role +
          " = ?, updated_by = ? WHERE document_code = ?",
        [update_status, role, role, id],
        function (err, results) {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          }
          res.json({ status: "ok" });
        }
      );
    }
  );
});

// ไม่อนุมัติ
app.post("/disapprove/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]]; //code
  const role = req.body.role;
  const comment = req.body.comment;
  const hospital = req.body.hospital;
  let status = 2; // ไม่อนุมัติ
  let update_status = 0; // ปรับเป็นสถานะต้องแก้ไข

  // ต้องมีการแจ้งเตือนไปที่คนยื่น แล้วปรับสถานะเป้น 0
  connection.query(
    "INSERT INTO approval (document_code,approver_id,approval_status,approval_comments,approval_hospital) VALUES (?,?,?,?,?)",
    [id, role, status, comment, hospital],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      connection.query(
        "UPDATE document SET document_status = ?, approve_" +
          role +
          " = ?, updated_by = ? WHERE document_code = ?",
        [update_status, role, role, id],
        function (err, results) {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          }
          res.json({ status: "ok" });
        }
      );
    }
  );
});

// แก้ไขคำร้อง
app.put("/document/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]];
  const topic = req.body.topic;
  const detail = req.body.detail;
  const file = req.body.file;
  const version = req.body.version;

  // เราต้องการ Version ของ form

  // Reset สถานะทุกๆอันก่อนหน้าที่จะไม่ผ่าน

  // connection.query(
  //   "DELETE FROM documents WHERE document_id = ?",
  //   [topic, detail, file,id],
  //   function (err, results) {
  //     if (err) {
  //       res.json({ status: "error", message: err });
  //       return;
  //     }
  //     res.json({ status: "ok" });
  //   }
  // );
});

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

// Count
// เช็คสถานะเอกสารทั้งหมด
app.get("/documents-all/:id", jsonParser, (req, res) => {
  const hospital_id = [req.params["id"]];

  connection.query(
    "SELECT COUNT(document_code) as COUNT FROM document WHERE hospital_id = ?",
    [hospital_id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok", data: results });
    }
  );
});

// เช็คสถานะเอกสารเสร็จสิ้น
app.get("/documents-end/:id", jsonParser, (req, res) => {
  const hospital_id = [req.params["id"]];
  const status_end = 5;

  connection.query(
    "SELECT COUNT(document_code) as COUNT FROM document WHERE document_status = ? AND hospital_id = ?",
    [status_end, hospital_id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok", data: results });
    }
  );
});

// เช็คสถานะเอกสารกำลังดำเนินการอยู่
app.get("/documents-process/:id", jsonParser, (req, res) => {
  const hospital_id = [req.params["id"]];
  const status_end = 5;

  connection.query(
    "SELECT COUNT(document_code) as COUNT FROM document WHERE document_status != ? AND hospital_id = ?",
    [status_end, hospital_id],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok", data: results });
    }
  );
});

// สร้างผู้ใช้งาน
app.post("/user", jsonParser, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const position = req.body.position;
  const role = req.body.role;
  const place = req.body.place;
  const hospital = req.body.hospital;

  connection.query(
    "INSERT INTO users (user_username,user_password,user_firstname,user_lastname,user_position,user_role,user_place,hospital_id) VALUES (?,?,?,?,?,?,?,?)",
    [username, password, firstname, lastname, position, role, place, hospital],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

// อัปเดตผู้ใช้งาน
app.put("/user", jsonParser, (req, res) => {});

// ลบผู้ใช้งาน
app.delete("/users/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]];
  connection.query(
    "DELETE FROM users WHERE user_id = ?",
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

// ดูโรงพยาบาลทั้งหมด
app.get("/hopital", jsonParser, (req, res) => {
  connection.query("SELECT * FROM hospital", function (err, results) {
    if (err) {
      res.json({ status: "error", message: err });
      return;
    }
    res.json({ status: "ok" });
  });
});

// สร้างโรงพยาบาล
app.post("/hopital", jsonParser, (req, res) => {
  const hospital_name = req.body.hospital;

  connection.query(
    "INSERT INTO hospital (hospital_name) VALUES (?)",
    [hospital_name],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok" });
    }
  );
});

// อัปเดตข้อมูลโรงพยาบาล
app.put("/hopital", jsonParser, (req, res) => {});

// ลบโรงพยาบาล
app.delete("/hospital/:id", jsonParser, (req, res) => {
  const id = [req.params["id"]];
  connection.query(
    "DELETE FROM hospital WHERE hospital_id = ?",
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

// Upload file document
app.post("/upload", (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send({ msg: "No file uploaded" });
  }
  const myFile = req.files.file;
  const filename = `${Date.now()}${myFile.name}`;
  myFile.mv(`${__dirname}/uploads/${filename}`, function (err) {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send({ msg: "Error occurred while uploading file" });
    }
    return res.send({ name: myFile.name, path: `/uploads/${filename}` });
  });
});

// Notification
// แสดงnotification ของแต่ละตำแหน่ง และ แต่ละโรงพยาบาล
app.get("/notification/:role/:hospital", jsonParser, (req, res) => {
  const role = [req.params["role"]];
  const hospital = req.params["hospital"];
  const status_unread = 0;
  connection.query(
    "SELECT * FROM notification WHERE notification_role = ? AND notification_place = ? AND notification_status = ?",
    [role, hospital, status_unread],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok", data: results });
    }
  );
});

app.get("/notification-count/:role/:hospital", jsonParser, (req, res) => {
  const role = [req.params["role"]];
  const hospital = req.params["hospital"];
  const status_unread = 0;
  connection.query(
    "SELECT COUNT(notification_id) as count FROM notification WHERE notification_role = ? AND notification_place = ? AND notification_status = ?",
    [role, hospital, status_unread],
    function (err, results) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      res.json({ status: "ok", count: results });
    }
  );
});

// ปรับสถานะเป็นอ่านทั้งหมด
app.put("/notification/read-all", jsonParser, (req, res) => {
  const role = req.body.role;
  const hospital = req.body.hospital;
  const status_read = 1;
  const status_unread = 0;
  connection.query(
    "UPDATE notification SET notification_status = ? WHERE notification_status = ? AND notification_role = ? AND notification_place = ? ",
    [status_read, status_unread, role, hospital],
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
