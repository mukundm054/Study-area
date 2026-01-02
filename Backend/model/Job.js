const { Type } = require("lucide-react")
const mongoose = require("mongoose")
const Jobschema = mongoose.Schema({
    title: String,
    company: String,
    location: String,
    Experience:String,
    category: String,
    aboutCompany: String,
    aboutJob: String,
    whoCanApply: String,
    perks: String,
    additionalInfo: String,
    CTC: String,
    startDate: String,
    createAt:{
        type:Date,
        default: Date.now
    }
})

module.exports=mongoose.model("Jobs",Jobschema)