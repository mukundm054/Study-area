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

    const plan = dbUser.subscription.plan;
    const planLimit = SUBSCRIPTION_PLAN[plan].limit;

    if (dbUser.subscription.applicationUsed >= planLimit) {
      return res
        .status(403)
        .json({ error: `Application Limit is reached for ${plan} plan` });
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

    dbUser.subscription.applicationUsed += 1;
    await dbUser.save();

    res
      .status(201)
      .json({ message: "Application Submitted successful", applicationData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Application.find();
    res.json(data).status(200);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Application.findById(id);
    if (!data) {
      res.status(404).json({ error: "Application not found" });
    }
    res.json(data).status(200);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  let status;
  if (action === "accepted") {
    status = "accepted";
  } else if (action === "rejected") {
    status = "rejected";
  } else {
    res.status(404).json({ error: "Internal Server Error" });
    return;
  }
  try {
    const updateapplication = await Application.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true },
    );
    if (!updateapplication) {
      res.status(404).json({ error: "Not able to update application" });
      return;
    }
    res.status(200).json({ sucess: true, data: updateapplication });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
