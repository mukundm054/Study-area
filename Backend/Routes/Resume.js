const express = require("express");
const router = express.Router();
const Resume = require("../model/Resume");

router.post("/", async (req, res) => {
  try {
    const resume = await Resume.create({
      ...req.body,
      isPaid: false,
    });
    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ error: "Resume creation failed" });
  }
});

router.get("/user/:id", async (req, res) => {
  const resumes = await Resume.find({ userId: req.params.id });
  res.json(resumes);
});

module.exports = router;
