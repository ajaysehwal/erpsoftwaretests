const express = require("express");

const app = express();
const cors = require("cors");
var bodyParser = require("body-parser");

const crypto = require("crypto");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());
// const db=require('./config/dbcon');
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "erpsystem",
});
db.connect(function (error) {
  if (error) {
    throw error;
  } else {
    console.log("MySQL Database is connected Successfully");
  }
});

const generateToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
};
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  res.send({ Message: "Welcome to our school management system" });
});
app.get("/signup", (req, res) => {
  const sql = "SELECT * FROM signupstep1";

  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    } else {
      return res.json(data);
    }
  });
});

app.get("/signup/:email", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const emailid = req.params.email;
  console.log(emailid);
  const sql = "SELECT * FROM `signupstep1` WHERE email=?";
  db.query(sql, emailid, (err, data) => {
    if (err) {
      return err;
    } else {
      return res.json(data);
    }
  });
});

app.post("/signup", (req, res) => {
  const schoolname = req.body.schoolname;
  const schoolurl = req.body.schoolurl;
  const email = req.body.email;
  const phone = req.body.phone;
  const user_token = req.body.user_token;

  const sql =
    "INSERT INTO `signupstep1`(`schoolname`,`schoolurl`,`email`,`phone`,`user_token`) VALUES (?,?,?,?,?)";

  db.query(
    sql,
    [schoolname, schoolurl, email, phone, user_token],
    (err, data) => {
      if (err) {
        return res.json(err);
      }

      return res.json(data);
    }
  );
});
app.get("/apisignup/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const userid = req.params.id;
  console.log(userid);
  const sql = "SELECT * FROM `signupstep1` WHERE user_token=?";
  db.query(sql,userid,(err, data) => {
    if (err) {
      return err;
    } else {
      return res.json(data);
    }
  });
});
app.post("/register_address", (req, res) => {
  const user_token = req.body.user_token;
  const country = req.body.country;
  const address = req.body.address;

  const sql =
    "INSERT INTO `signupstep2-address`(`user_token`,`country`,`schooladdress`) VALUES (?,?,?)";

  db.query(sql, [user_token, country, address], (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
app.get("/register_address/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const userid = req.params.id;
  // console.log(emailid);
  const sql = "SELECT * FROM `signupstep2-address` WHERE user_token=?";
  db.query(sql, userid, (err, data) => {
    if (err) {
      return err;
    } else {
      return res.json(data);
    }
  });
});
app.get("/register_address", (req, res) => {
  const sql = "SELECT * FROM `signupstep2-address`";

  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    } else {
      return res.json(data);
    }
  });
});
app.post("/admindata", (req, res) => {
  const user_token = req.body.user_token;
  const admin_name = req.body.admin_name;
  const admin_email = req.body.admin_email;
  const admin_password=req.body.admin_password;
  const admin_phone=req.body.admin_phone
  const admin_confirmPassword=req.body.admin_confirmPassword;


  const sql =
    "INSERT INTO `signup-info`(`user_token`,`admin_name`,`admin_email`, `admin_password`, `admin_phone`,`admin_confirmPassword`) VALUES (?,?,?,?,?,?)";

  db.query(sql, [user_token,admin_name,admin_email,admin_password,admin_phone,admin_confirmPassword], (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
app.get("/admindata", (req, res) => {
  const sql = "SELECT * FROM `signup-info`";

  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    } else {
      return res.json(data);
    }
  });
});
app.get("/admindata/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const userid = req.params.id;
  // console.log(emailid);
  const sql = "SELECT * FROM `signup-info` WHERE user_token=?";
  db.query(sql, userid, (err, data) => {
    if (err) {
      return err;
    } else {
      return res.json(data);
    }
  });
});
app.get("/apiadmindata/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const userid = req.params.id;
  // console.log(emailid);
  const sql = "SELECT * FROM `signup-info` WHERE admin_email=?";
  db.query(sql, userid, (err, data) => {
    if (err) {
      return err;
    } else {
      return res.json(data);
    }
  });
});
app.listen(8000, () => {
  console.log("started server");
});
