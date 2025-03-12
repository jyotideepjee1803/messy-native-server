const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    userId: String,
    orderId: String,
    selected : [
        [false, false, false, false, false, false, false], // Breakfast
        [false, false, false, false, false, false, false], // Lunch
        [false, false, false, false, false, false, false]  // Dinner
    ],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600,// this is the expiry time in seconds
    },
})

const Payment = mongoose.model('Payment', paymentSchema);
exports.Payment = Payment