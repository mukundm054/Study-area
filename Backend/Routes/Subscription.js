const express = require("express");
const router = express.Router();
const razorpay = require("../config/razorpay");
const SUBSCRIPTION_PLAN = require("../config/subscriptionPlan");
const crypto = require("crypto");
const { error } = require("console");
const User = require("../model/User");
const transports = require("../config/mailer");

router.post("/create-payment", async (req, res) => {
  try {
    const { plan } = req.body;
    if (!SUBSCRIPTION_PLAN[plan]) {
      return res.status(400).json({ error: "invalid plan" });
    }
    const now = new Date();
    const istTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    const hour = istTime.getHours();
    if (hour < 10 || hour >= 11) {
      return res
        .status(403)
        .json({ error: "payment allow only between 10 AM  and 11 AM IST" });
    }
    const amount = SUBSCRIPTION_PLAN[plan].price * 100;
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "payment creation failed" });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      plan,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "user not found" });

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    user.subscription.plan = plan;
    user.subscription.expiresAt = expiry;
    user.subscription.applicationUsed = 0;

    if (!SUBSCRIPTION_PLAN[plan]) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    await user.save();

    const planDetails = SUBSCRIPTION_PLAN[plan];

    await transports.sendMail({
      from: `"Studyarea" <${process.env.EMAIL_USER}> `,
      to: user.email,
      subject: "Subscription Activated",
      html: `
      <h2>Subscription Successful</h2>
    <p><strong>Plan:</strong> ${plan}</p>
    <p><strong>Amount Paid:</strong> ₹${planDetails.price}</p>
    <p><strong>Valid Till:</strong> ${expiry.toDateString()}</p>
    <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
    <br/>
    <p>Thank you for subscribing to StudyArea </p>
      `,
    });

    res.json({
      message: "payment verified and subscription activated",
      plan,
      expiresAt: expiry,
    });
  } catch (error) {
    res.status(500).json({ error: "payment verification failed" });
  }
});

module.exports = router;
