const { Coupon } = require('../../Models/coupon');
const PaymentService = require('./services')

module.exports = {
    initiatePayment: async(req, res)=>{
        console.log(req.body)
        const {userId, selected,amount} = req.body;

        if (!userId || !selected || !amount) {
            return res.status(400).send({ message: "Missing required fields!" });
        }

        try{           
            // const existingCoupons = await Coupon.find({ userId }).sort({ createdAt: -1 });
            // if (existingCoupons.length >= 2) {
            //     return res.status(400).send({ message: "You can only have a maximum of 2 coupons."});
            // }

            // const currentDate = new Date();
            // // Allow a new coupon only if 5 days have passed since the last coupon's creation
            // if (existingCoupons.length > 0 && (currentDate - existingCoupons[0].createdAt) / (1000 * 60 * 60 * 24) < 5) {
            //     console.log("You can only buy a new coupon 5 days after the last purchase");
            //     return res.status(400).send({message:"You can only buy a new coupon 5 days after the last purchase"});
            // }
      
            const result = await PaymentService.initiatePayment(userId, selected,amount)
            console.log(result);
            return res.send(result)
        }catch(error){
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    paymentStatus: async(req,res)=>{
        try{
            const {userId} = req.query
            const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
            const result = await PaymentService.paymentStatus(userId, razorpay_order_id, razorpay_payment_id, razorpay_signature)

            return res.json(result)
        }catch(error){
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
};