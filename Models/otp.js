const mongoose = require('mongoose');
const sendOtpEmail = require('../utils/sendOTPMail');

const otpSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    otp:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5,
    },
});

otpSchema.pre("save", async (next) => {
    if(this.isNew){
        await sendOtpEmail(this.email, this.otp);
    }

    next();
});

const OTP = mongoose.model("OTP", otpSchema);
exports.OTP = OTP;
