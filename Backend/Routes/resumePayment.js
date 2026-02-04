const express = require("express");
const router = express.Router();
const razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../model/User");
const Razorpay = require("razorpay");

const RESUME_AMOUNT = 50 * 100;

router.post("/create-payment", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User id required" });
    }

    const order = await razorpay.orders.create({
      amount: RESUME_AMOUNT,
      currency: "INR",
      receipt: `resume_${Date.now()}`,
    });

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Resume payment  failed" });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");
    
    if(expectedSignature !==razorpay_signature){
        return res.status(400).json({error:"Invalid payment signature"})
    }

    const user = await User.findById(userId)
    if(!user) return res.status(404).json({error:"User not found"})

    const expire = new Date()
    expire.setDate(expire.getDate()+30)

    user.resumePlan.active=true
    user.resumePlan.expiresAt=expire

    await user.save()

    res.json({
        message:"resume plan activate",
        expiresAt:expire
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({error:"payment varification failed"})
  }
});

module.exports=router
