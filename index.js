const express = require("express");
const expresshandlebars = require("express-handlebars");
const app = express();
const multer = require("multer");
const fs = require("fs");
app.engine(
  "handlebars",
  expresshandlebars({
    layoutsDir: __dirname + "/views/layouts",
    defaultLayout: "main",
  })
);

app.use(express.static("views"));
app.use(express.static("public"));

//Tao thu muc luu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/upload/data/");
  },
  filename: function (req, file, cb) {
    //tên file
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix+file.originalname);
  },
});


const uploads = multer({
  dest: "./public/data/uploads/",
  storage: storage,
  limits: {
    fileSize: 2048 * 2048, //gioi han file size <= 2MB
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/jpeg') {
      req.fileValidationError = 'Chi chap nhan file JPG';
      return cb(null, false, new Error('Chi chap nhan file JPG'));
    }
    cb(null, true);
  }
}).array("avatar",5);



app.set("view engine", "handlebars");

app.get("/", function (req, res) {
  res.render("index");
});
app.get("/login", function (req, res) {
  res.render("Login");
});

app.get("/signup", function (req, res) {
  res.render("Signup");
});
app.get("/fs", function (req, res) {
  res.render("File");
});
app.get("/insert", function (req, res) {
  fs.writeFile("test.txt", "/n Ghi vao file thu xem", function (err, data) {
    if (err == null) {
      res.send("Ghi thanh cong");
    } else {
      res.send(err);
    }
  });
});
app.get("/append", function (req, res) {
  fs.appendFile("test.txt", "\n Ghi vao file thu xem 2", function (err) {
    if (err == null) {
      res.send("Ghi thanh cong");
    } else {
      res.send(err);
    }
  });
});
app.get("/unlink", function (req, res) {
  fs.unlink("test.txt", function (err) {
    if (err == null) {
      res.send("Xoa thanh cong");
    } else {
      res.send(err);
    }
  });
});
app.get("/rename", function (req, res) {
  fs.rename("test.txt", "test2.txt", function (err) {
    if (err == null) {
      res.send("Rename thanh cong");
    } else {
      res.send(err);
    }
  });
});

app.get("/upload", function (req, res) {
  res.render("upload");
});


app.post("/profile", function (req, res) {
  uploads(req,res,function (err){
    if(err instanceof multer.MulterError){
      return res.send("File qua lon")
    }else if (err){
      return  res.send("Something wrong")
    }else if(req.fileValidationError) {
      return res.end(req.fileValidationError);
    }
    res.send('Thanh cong')
  })
});



app.listen(process.env.PORT || "3000");
