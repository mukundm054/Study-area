const express = require("express");
const router = express.Router();
const Resume = require("../model/Resume");
const ResumeOTP = require("../model/ResumeOTP");
const generateOtp = require("../utils/generateOtp");
const transporter = require("../config/mailer");
const { model } = require("mongoose");


router.post("/send-otp", async (req, res) => {
  try {
    const { resumeId } = req.body;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    if (resume.isPaid) {
      return res.status(400).json({ error: "Resume already paid" });
    }

    const otp = generateOtp();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); 

    await ResumeOTP.deleteMany({ resumeId }); 

    await ResumeOTP.create({
      resumeId,
      email: resume.personal.email,
      otp,
      expiresAt,
    });

    await transporter.sendMail({
      from: `"StudyArea" <${process.env.EMAIL_USER}>`,
      to: resume.personal.email,
      subject: "Resume Payment OTP",
      html: `
        <h3>OTP Verification</h3>
        <p>Your OTP for resume payment is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});


router.post("/verify-otp", async (req, res) => {
  try {
    const { resumeId, otp } = req.body;

    const record = await ResumeOTP.findOne({ resumeId });

    if (!record) {
      return res.status(400).json({ error: "OTP not found" });
    }

    if (record.verified) {
      return res.status(400).json({ error: "OTP already verified" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    record.verified = true;
    await record.save();

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "OTP verification failed" });
  }
});


module.exports=router

