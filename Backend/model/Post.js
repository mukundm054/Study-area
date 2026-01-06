const mongoose = require("mongoose");

const Commentschema = mongoose.Schema({
  
  userEmail:String,

  text: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Postschema = mongoose.Schema({
  userEmail: {
    type: String,
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

  likes: [String],

  caption: {
    type: String,
  },

  comments: [Commentschema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", Postschema);
