const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../model/User");

function genreatePassword(length = 10) {
  const chars =
    "ABCDERFGHIJKLMNOPQRESTUYWXYZabcdefghijklmnopqrstuABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  return password;
}

router.post("/signup", async (req, res) => {
  try {
    if ((!email && !phone) || !password) {
      return res
        .status(400)
        .json({ error: "Email or phone and password required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({ error: "User alredy existi" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashPassword,
      authProvider: "local",
    });

    res.json({ message: "Signup sucsessful", user });
  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user || user.authProvider !== "local") {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email, phone } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.authProvider === "google") {
      return res
        .status(400)
        .json({ error: "Google users cannot reset password" });
    }

    const today = new Date().toDateString();

    if (user.lastPasswordReset === today) {
      return res
        .status(403)
        .json({ error: "You can use this option only once per day" });
    }

    const newPassword = genreatePassword();
    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    user.lastPasswordReset = today;
    await user.save();

    res.json({
      message: "Password reset successful",
      newPassword,
    });
  } catch (error) {
    res.status(500).json({ error: "Password reset failed" });
  }
});

module.exports = router;
