const express = require("express");
const router = express.Router();
const User = require("../model/User");
const { model } = require("mongoose");

router.post("/create", async (req, res) => {
  const { uid, name, email, photo } = req.body;

  let user = await User.findOne({ uid });
  if (user) return res.json(user);

  user = await User.create({ uid, name, email, photo });
  res.json(user);
});

router.put("/add-friend/:id", async (req, res) => {
  const { frinedId } = req.body;

  const user = await User.findById(req.params.id);

  if (!user.friends.includes(frinedId)) {
    user.friends.push(frinedId);
    await user.save();
  }

  res.json(user);
});

router.put("/remove-friend/:id", async (req, res) => {
  const { frinedId } = req.body;

  const user = await User.findById(req.params.id);
  user.friends = user.friends.filter((f) => f.toString() !== frinedId);
  await user.save();

  res.json(user);
});

router.get("/:id/friends-count", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({ count: user.friends.length });
});

module.exports = router;
