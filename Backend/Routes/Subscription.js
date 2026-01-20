const express = require("express");
const router = express.Router();
const razorpay = require("../config/razorpay");
const SUBSCRIPTION_PLAN = require("../config/subscriptionPlan");

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
    const order = razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `recipt_${Date.now()}`,
    });
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "payment creation failed" });
  }
});

module.exports = router;
