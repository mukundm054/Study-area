const express = require("express");
const router = express.Router();
const admin = require("./Admin");
const intern = require("./Intership");
const job = require("./Job");
const application = require("./Application")
const User = require("./User");
const Post = require("./Post")

router.use("/admin", admin);
router.use("/interships", intern);
router.use("/jobs", job);
router.use("/application",application)
router.use("/user,", User);
router.use("/post",Post)
module.exports = router;
