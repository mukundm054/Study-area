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
  try {
    const { userEmail, friendEmail } = req.body;

    if (userEmail === friendEmail) {
      return res.status(400).json({ error: "You cannot add yourself" });
    }

    const user = await User.findOne({ email: userEmail });
    const friend = await User.findOne({ email: friendEmail });

    if (!user || !friend) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.friends.includes(friendEmail)) {
      user.friends.push(friendEmail);
      await user.save();
    }

    res.json({ message: "Friend added", friends: user.friends });
  } catch (error) {
    res.status(500).json({ error: "Failed to add friend" });
  }
});

router.put("/add-friend", async (req, res) => {
  const { userEmail, friendEmail } = req.body;

  const user = await User.findOne({ email: userEmail });
  const friend = await User.findOne({ email: friendEmail });

  if (!user || !friend) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!user.friends.includes(friend.email)) {
    user.friends.push(friend.email);
    await user.save();
  }

  res.json({ message: "Friend added", friends: user.friends });
});

router.get("/friends-count/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) return res.status(404).json({ count: 0 });
  res.json({ count: user.friends.length });
});

router.post("/friends-count", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ count: user.friends.length });
});

module.exports = router;
