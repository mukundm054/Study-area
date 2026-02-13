const mongoose = require("mongoose");

const LanguageOTPSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },

    email: {
      type: String,
      require: true,
    },

    otp: {
      type: String,
      require: true,
    },

    expiresAt: {
      type: Date,
      require: true,
    },

    verified: {
      type: Boolean,
      require: false,
    },
  },

  { Timestamp: true },
);

module.exports = mongoose.model("LanguageOTP", LanguageOTPSchema);
