const express = require("express");
const router = express.Router();
const Resume = require("../model/Resume");

router.post("/", async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(400).json({ error: "userId required" });
    }

    const resume = await Resume.create({
      ...req.body,
      isPaid: false,
    });

    res.status(201).json(resume);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Resume creation failed" });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.params.id });
    res.json(resumes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Resumes not found" });
  }
});

module.exports = router;
