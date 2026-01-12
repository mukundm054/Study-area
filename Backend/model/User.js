const mongoose = require("mongoose");

const Userschema = new mongoose.Schema({
  uid: { type: String, unique: true, sparse: true },

  name: String,

  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },

  photo: String,

  password: String,

  authProvider: {
    type: String,
    enum: ["google", "email", "phone"],
    required: true,
  },

  friends: [String],

  lastPasswordReset: {
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", Userschema);
