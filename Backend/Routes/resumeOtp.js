const express = require("express");
const router = express.Router();
const Resume = require("../model/Resume");
const ResumeOTP = require("../model/resumeOtp")
const generateOtp = require("../utils/generateOtp");
const transporter = require("../config/mailer");

router.post("/send-otp", async (req, res) => {
  const { resumeId } = req.body;

  const resume = await Resume.findById(resumeId);
  if (!resume) return res.status(404).json({ error: "Resume not found" });

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await ResumeOTP.deleteMany({ resumeId });

  await ResumeOTP.create({
    resumeId,
    email: resume.personal.email,
    otp,
    expiresAt,
  });

  await transporter.sendMail({
    to: resume.personal.email,
    subject: "Resume OTP Verification",
    html: `<h2>Your OTP: ${otp}</h2>`,
  });

  res.json({ message: "OTP sent" });
});

router.post("/verify-otp", async (req, res) => {
  const { resumeId, otp } = req.body;

  const record = await ResumeOTP.findOne({ resumeId });
  if (!record) return res.status(400).json({ error: "OTP not found" });
  if (record.expiresAt < new Date()) return res.status(400).json({ error: "OTP expired" });
  if (record.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

  record.verified = true;
  await record.save();

  res.json({ message: "OTP verified" });
});

module.exports = router;
