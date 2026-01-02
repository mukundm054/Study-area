const express = require("express");
const router = express.Router();
const admin = require("./Admin");
const intern = require("./Intership");
const job = require("./Job");
const application = require("./Application")

router.use("/admin", admin);
router.use("/interships", intern);
router.use("/jobs", job);
router.use("/application",application)
module.exports = router;
