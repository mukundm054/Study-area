const express = require("express");
const router = express.Router();

const Application = require("../model/Application");
const User = require("../model/User");
const Resume = require("../model/Resume");
const SUBSCRIPTION_PLAN = require("../config/subscriptionPlan");

router.post("/", async (req, res) => {
  try {
    const { user, internship } = req.body;

   
    const dbUser = await User.findById(user);
    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }

    
    const paidResume = await Resume.findOne({
      userId: user,
      isPaid: true,
    });

    if (!paidResume) {
      return res.status(403).json({
        error: "You must have a paid resume to apply",
      });
    }

    
    const { plan, expiresAt, applicationUsed } = dbUser.subscription;

    if (plan !== "FREE" && expiresAt && expiresAt < new Date()) {
      return res.status(403).json({
        error: "Subscription expired. Please renew your plan.",
      });
    }

    const planLimit = SUBSCRIPTION_PLAN[plan].limit;

    if (plan !== "GOLD" && applicationUsed >= planLimit) {
      return res.status(403).json({
        error: `Application limit reached for ${plan} plan`,
      });
    }

    
    const applicationData = new Application({
      company: req.body.company,
      category: req.body.category,
      coverLetter: req.body.coverLetter,
      availability: req.body.availability,
      user,
      internship,
      resume: paidResume._id, 
    });

    await applicationData.save();

    
    if (plan !== "GOLD") {
      dbUser.subscription.applicationUsed += 1;
      await dbUser.save();
    }

    res.status(201).json({
      message: "Application submitted successfully",
      application: applicationData,
      resumeAttached: true,
      plan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
