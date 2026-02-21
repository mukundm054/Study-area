const express = require("express");
const router = express.Router();
const admin = require("./Admin");
const intern = require("./Intership");
const job = require("./Job");
const application = require("./Application");
const User = require("./User");
const Post = require("./Post");
const subscription = require("./Subscription");
const resume = require("./Resume");
const resumePayment = require("./resumePayment");
const resumeOpt = require("./resumeOtp");
const language = require("./Language");
const auth = require("./Auth")

router.use("/admin", admin);
router.use("/interships", intern);
router.use("/jobs", job);
router.use("/application", application);
router.use("/user", User);
router.use("/post", Post);
router.use("/subscription", subscription);
router.use("/resume", resume);
router.use("/resume-payment", resumePayment);
router.use("/resume-otp", resumeOpt);
router.use("/language", language);
router.use("/auth",auth)

module.exports = router;
