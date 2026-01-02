const express = require("express");
const router = express.Router();
const adminuser = "admin";
const adminpass = "admin";

router.post("/adminlogin", (req, res) => {
  const { userName, passWord } = req.body;

  if (userName === adminuser && passWord === adminpass) {
    res.send("admin is here");
  } else {
    res.status(401).send("unauthrized");
  }
});

module.exports = router;
