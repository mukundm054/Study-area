const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  company: { type: String, required: true },
  category: { type: String, required: true },
  coverLetter: { type: String, required: true },
  availability: { type: String, required: true },
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Interships", 
    required: true,
  },
  user: { type: Object, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["accepted", "pending", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Application", ApplicationSchema);
