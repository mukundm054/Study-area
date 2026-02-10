const mongoose = require("mongoose");

const ResumeOTPSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    email: String,
    otp: String,
    expiresAt: Date,
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeOTP", ResumeOTPSchema);
