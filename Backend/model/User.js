const mongoose= require("mongoose")

const Userschema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    name:String,
    email:String,
    photo:String,

    friends:[{
         type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },   
    ],

    
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("User", Userschema);