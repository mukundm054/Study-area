const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
      index: true,
    },

    personal: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      summary: String,
    },

    education: [
      {
        institute: String, 
        degree: String,
        startYear: String,
        endYear: String,
      },
    ],

    experience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    skills: [String],

    photo: String,

    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Resume", ResumeSchema);
