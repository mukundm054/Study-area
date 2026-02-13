const express = require("express");
const router = express.Router();
const User = require("../model/User");
const LanguageOTP = require("../model/LanguageOTP");
const generateOtp = require("../utils/generateOtp");
const transporter = require("../config/mailer");



router.post("/send-otp", async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOtp();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await LanguageOTP.deleteMany({ userId });

    await LanguageOTP.create({
      userId,
      email: user.email,
      otp,
      expiresAt,
    });

    await transporter.sendMail({
      from: `"StudyArea" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "French Language OTP Verification",
      html: `
        <h3>OTP Verification</h3>
        <p>Your OTP to enable French language is:</p>
        <h2>${otp}</h2>
        <p>Valid for 10 minutes.</p>
      `,
    });

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
});



router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const record = await LanguageOTP.findOne({ userId });

    if (!record) return res.status(400).json({ error: "OTP not found" });

    if (record.expiresAt < new Date())
      return res.status(400).json({ error: "OTP expired" });

    if (record.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    record.verified = true;
    await record.save();

    await User.findByIdAndUpdate(userId, {
      preferredLanguage: "fr",
    });

    res.json({ message: "French language activated" });

  } catch (error) {
    res.status(500).json({ error: "Verification failed" });
  }
});



router.post("/update", async (req, res) => {
  try {
    const { userId, language } = req.body;

    if (language === "fr") {
      return res.status(400).json({
        error: "French requires OTP verification",
      });
    }

    await User.findByIdAndUpdate(userId, {
      preferredLanguage: language,
    });

    res.json({ message: "Language updated" });

  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
