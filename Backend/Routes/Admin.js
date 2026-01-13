const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Admin = require("../model/Admin");


function generatePassword(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}


router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({
        error: "Email or phone and password required",
      });
    }

    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.json({
      message: "Admin signup successful",
      admin,
    });
  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    const admin = await Admin.findOne({
      $or: [{ email }, { phone }],
    });

    if (!admin) {
      return res.status(400).json({ error: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.json({
      message: "Admin login successful",
      admin,
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});


router.post("/forgot-password", async (req, res) => {
  try {
    const { email, phone } = req.body;

    const admin = await Admin.findOne({
      $or: [{ email }, { phone }],
    });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const today = new Date().toDateString();

    if (
      admin.lastPasswordReset &&
      admin.lastPasswordReset.toDateString() === today
    ) {
      return res.status(403).json({
        error: "You can use this option only once per day",
      });
    }

    const newPassword = generatePassword();
    const hashed = await bcrypt.hash(newPassword, 10);

    admin.password = hashed;
    admin.lastPasswordReset = new Date();
    await admin.save();

    res.json({
      message: "Password reset successful",
      newPassword, 
    });
  } catch (error) {
    res.status(500).json({ error: "Password reset failed" });
  }
});

module.exports = router;
