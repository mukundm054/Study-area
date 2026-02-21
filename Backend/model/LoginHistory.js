const mongoose = require("mongoose");

const LoginHistorySchema = mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },

        browser:String,
        os:String,
        device:String,
        ip:String,

        status:{
            type:String,
            enum:['SUCCESS','BLOCKED','OTP_REQUIRED']
        },

        loginTime:{
            type:Date,
            default:Date.now
        },
        
    },
    {timestamps:true}
);

module.exports=mongoose.model("LoginHistory",LoginHistorySchema)
