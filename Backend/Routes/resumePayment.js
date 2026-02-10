const express = require("express");
const router = express.Router();
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Resume = require("../model/Resume");
const ResumeOTP = require("../model/resumeOtp");

const AMOUNT = 50 * 100;

router.post("/create-payment", async (req, res) => {
  const { resumeId } = req.body;

  const verified = await ResumeOTP.findOne({ resumeId, verified: true });
  if (!verified) return res.status(403).json({ error: "OTP not verified" });

  const order = await razorpay.orders.create({
    amount: AMOUNT,
    currency: "INR",
    receipt: `resume_${resumeId}`,
  });

  res.json(order);
});

router.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, resumeId } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expected !== razorpay_signature)
    return res.status(400).json({ error: "Invalid signature" });

  await Resume.findByIdAndUpdate(resumeId, { isPaid: true });

  res.json({ message: "Resume unlocked" });
});

module.exports = router;
