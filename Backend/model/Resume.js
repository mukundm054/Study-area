const mongoose = require("mongoose")

const ResumeSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },

    personal:{
       fullName:String,
       email:String,
       phone:String,
       address:String,
       summary:String
    },

    education:[
        {
            insitute:String,
            degree:String,
            startYear:String,
            endYear:String
        }
    ],

    experience:[
        {
            company:String,
            role:String,
            startDate:String,
            endDate:String,
            description:String
        }
    ],

    skills:[String],

    photo:String,

     createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Resume", ResumeSchema);