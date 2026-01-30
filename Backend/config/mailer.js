const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gamil",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;
