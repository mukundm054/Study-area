const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Resume = require("../model/Resume");
const ResumeOTP = require("../model/Otp");

const RESUME_AMOUNT = 50 * 100; // ₹50

router.post("/create-payment", async (req, res) => {
  try {
    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({ error: "Resume ID required" });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    if (resume.isPaid) {
      return res.status(400).json({ error: "Resume already paid" });
    }

    const otpRecord = await ResumeOTP.findOne({
      resumeId,
      verified: true,
    });

    if (!otpRecord) {
      return res
        .status(403)
        .json({ error: "OTP verification required before payment" });
    }

    const order = await razorpay.orders.create({
      amount: RESUME_AMOUNT,
      currency: "INR",
      receipt: `resume_${resumeId}`,
    });

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Resume payment failed" });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      resumeId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    resume.isPaid = true;
    await resume.save();

    res.json({ message: "Resume payment successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

module.exports = router;
