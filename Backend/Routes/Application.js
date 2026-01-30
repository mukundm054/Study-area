const express = require("express");
const router = express.Router();

const Application = require("../model/Application");
const User = require("../model/User");
const SUBSCRIPTION_PLAN = require("../config/subscriptionPlan");

router.post("/", async (req, res) => {
  try {
    const { user, internship } = req.body;

    const dbUser = await User.findById(user);
    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const { plan, expiresAt, applicationUsed } = dbUser.subscription;

    
    if (
      plan !== "FREE" &&
      expiresAt &&
      expiresAt < new Date()
    ) {
      return res.status(403).json({
        error: "Subscription expired. Please renew your plan.",
      });
    }

    const planLimit = SUBSCRIPTION_PLAN[plan].limit;

    
    if (
      plan !== "GOLD" &&
      applicationUsed >= planLimit
    ) {
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
    });

    await applicationData.save();

    
    if (plan !== "GOLD") {
      dbUser.subscription.applicationUsed += 1;
      await dbUser.save();
    }

    res.status(201).json({
      message: "Application submitted successfully",
      application: applicationData,
      applicationsUsed: dbUser.subscription.applicationUsed,
      plan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Application.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await Application.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { action } = req.body;
    const status =
      action === "accepted"
        ? "accepted"
        : action === "rejected"
        ? "rejected"
        : null;

    if (!status) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
