const { Type } = require("lucide-react")
const mongoose = require("mongoose")

const Adminschema = new mongoose.Schema({
    name:String,

    email:{type:String,unique:true,sparse:true},
    phone:{type:String,unique:true,sparse:true},

    password:{type:String,required:true},

    lastPasswordReset:{
        type:Date,
        default:null
    },

    createAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Admin", Adminschema);