const express = require("express");
const router = express.Router();

const Application = require("../model/Application");

router.post("/", async (req, res) => {
  const applicationData = new Application({
    company: req.body.company,
    category: req.body.category,
    coverLetter: req.body.coverLetter,
    availability: req.body.availability,
    user: req.body.user,
    internship: req.body.internship,
  });
  await applicationData
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log(error);
    });
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
      { new: true }
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
