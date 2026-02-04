const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },

  name: String,
  email: { type: String, required: true, unique: true },
  photo: String,

  subscription: {
    plan: {
      type: String,
      enum: ["FREE", "BRONZE", "SILVER", "GOLD"],
      default: "FREE",
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    applicationUsed: {
      type: Number,
      default: 0,
    },
  },

  friends: [String],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  resumePlan: {
    active: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
});

module.exports = mongoose.model("User", UserSchema);
