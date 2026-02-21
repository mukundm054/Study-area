const mongoose = require("mongoose");

const LoginOTPSchema = mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },

        otp:String,
        expiresAt:Date,
        verified:{
            type:Boolean,
            default:false
        }
    },
    {timestamps:true}
);


module.exports=mongoose.model("LoginOTP",LoginOTPSchema)
