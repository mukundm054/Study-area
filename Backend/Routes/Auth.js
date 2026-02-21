const express = require("express");
const router = express.Router();
const UAParser = require("ua-parser-js");

const User = require("../model/User");
const LoginHistory = require("../model/LoginHistory");
const LoginOTP = require("../model/LoginOTP");
const generateOtp = require("../utils/generateOtp");
const transporter = require("../config/mailer");

router.post("/login", async (req, res) => {
  try {
    const { uid, name, email, photo } = req.body;

    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();

    const browser = result.browser.name || "Unknown";
    const os = result.os.name || "Unknown";
    const device = result.device.type || "desktop";

    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

    
    if (device === "mobile") {
      const ist = new Date(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        })
      );

      const hour = ist.getHours();

      if (hour < 10 || hour >= 13) {
        await LoginHistory.create({
          browser,
          os,
          device,
          ip,
          status: "BLOCKED",
        });

        return res.status(403).json({
          error: "Mobile login allowed only between 10AM - 1PM IST",
        });
      }
    }

    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({
        uid,
        name,
        email,
        photo,
      });
    }

    
    if (browser === "Chrome") {
      const otp = generateOtp();

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      await LoginOTP.deleteMany({ userId: user._id });

      await LoginOTP.create({
        userId: user._id,
        otp,
        expiresAt,
      });

      await transporter.sendMail({
        from: `"StudyArea" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Login OTP Verification",
        html: `<h2>Your Login OTP: ${otp}</h2>`,
      });

      await LoginHistory.create({
        userId: user._id,
        browser,
        os,
        device,
        ip,
        status: "OTP_REQUIRED",
      });

      return res.json({
        otpRequired: true,
        userId: user._id,
      });
    }

   
    await LoginHistory.create({
      userId: user._id,
      browser,
      os,
      device,
      ip,
      status: "SUCCESS",
    });

    res.json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/verify-login-otp", async (req, res) => {
  const { userId, otp } = req.body;

  const record = await LoginOTP.findOne({ userId });

  if (!record)
    return res.status(400).json({ error: "OTP not found" });

  if (record.expiresAt < new Date())
    return res.status(400).json({ error: "OTP expired" });

  if (record.otp !== otp)
    return res.status(400).json({ error: "Invalid OTP" });

  record.verified = true;
  await record.save();

  await LoginHistory.create({
    userId,
    status: "SUCCESS",
  });

  res.json({ success: true });
});


router.get("/login-history/:id", async (req, res) => {
  const history = await LoginHistory.find({
    userId: req.params.id,
  }).sort({ createdAt: -1 });

  res.json(history);
});


module.exports=router