const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    userId : String,
    taken: Boolean,
    week: [
        [false, false, false, false, false, false, false], // Breakfast
        [false, false, false, false, false, false, false], // Lunch
        [false, false, false, false, false, false, false]  // Dinner
    ],
    qrInfo: {
        type: Map,
        of: {
            qrCode: String,  // Encoded QR data
            scanned: { type: Boolean, default: false }, // If QR is scanned
            createdAt: { type: Date, default: Date.now } // QR generation time
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 864000,// this is the expiry time in seconds (10 days)
    },
},{timestamps: true});

const Coupon = mongoose.model("Coupon", couponSchema);

exports.Coupon = Coupon;