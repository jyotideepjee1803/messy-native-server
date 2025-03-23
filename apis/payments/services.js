const Razorpay = require('razorpay')
const {Payment} = require('../../Models/payment')
const {Coupon} = require('../../Models/coupon');
const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');

const razorpay = new Razorpay({key_id : process.env.RAZORPAY_ID_KEY, key_secret: process.env.RAZORPAY_SECRET_KEY});

module.exports = {
    initiatePayment : async(userId, selected, amount) => {
        try {
            // Validate amount
            if (!amount || isNaN(amount) || amount <= 0) {
              throw new Error("Invalid amount provided");
            }
        
            // Create order with Razorpay
            const order = await razorpay.orders.create({
              amount: amount * 100, // Convert amount to paise
              currency: "INR",
            });

        
            // Save payment details in the database
            const paymentRecord = await Payment.create({
              userId,
              orderId: order.id,
              selected,
            });
        
            // Return the Razorpay order details
            return order;
        } catch (error) {
            console.error("Error initiating payment:", error.message);
            throw error; // Re-throw the error for handling at a higher level
        }        
    },

    paymentStatus : async(user_id, order_id, payment_id, razorpay_signature) => {
        const pay = validatePaymentVerification({order_id, payment_id}, razorpay_signature, process.env.RAZORPAY_SECRET_KEY);
        if(pay){
            const order = await Payment.findOne({orderId: order_id});
            const weekData = order.selected;
            const qrInfo = {};
            for (let mealIndex = 0; mealIndex < 3; mealIndex++) { // 0: Breakfast, 1: Lunch, 2: Dinner
              for (let dayIndex = 0; dayIndex < 7; dayIndex++) { // 7 days a week
                if (weekData[mealIndex][dayIndex]) {
                  const qrKey = `${dayIndex}-${mealIndex}`;
                  qrInfo[qrKey] = {
                    qrCode: `${user_id}-${dayIndex}-${mealIndex}`, // Simple QR Format
                    scanned: false,
                    createdAt: new Date(),
                  };
                }
              }
            }
            await Coupon.updateOne({userId: user_id},{$set : {week : order.selected,taken : true,  qrInfo: qrInfo}}, { upsert: true });
        }

        return pay;
    }

}
