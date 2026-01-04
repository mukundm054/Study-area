const mongoose = require("mongoose");

const Commentschema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  text: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Postschema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  mediaUrl: {
    type: String,
    required: true,
  },

  mediaType: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },

  caption: {
    type: String,
  },

  comments: [Commentschema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
