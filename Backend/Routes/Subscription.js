const { json } = require("body-parser");
const express = require("express");
const router = express.Router();

router.post("/create-payment", async (req, res) => {
  const now = new Date();

  const istTime = new Date(
    now.toLocaleString("en-us", { timeZone: "asia/kolkata" }),
  );

  const hour = istTime.getHours();

  if (hour < 10 || hour > 11) {
    return res.status(403).json({
      error: "Payments allowed only between 10:00 AM and 11:00 AM IST",
    });

    res.json({message:"payment window valid"})
  }
});

module.exports=router
