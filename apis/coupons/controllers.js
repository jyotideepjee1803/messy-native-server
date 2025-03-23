const { Coupon } = require('../../Models/coupon');
const CouponService = require('./services');

module.exports = {
  userCoupon: async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).send({ message: "User ID is required!" });
    }

    try {
      const coupons = await Coupon.find({ userId }).select({ _id: 0 }).sort({ createdAt: -1 });

      if (coupons.length === 0) {
        return res.status(200).send({ message: "Coupon not found for this user!" });
      }

      const validCoupons = coupons.slice(0, 2);
      res.json({ coupons: validCoupons });

    } catch (error) {
      console.error("Error in userCoupon:", error);
      res.status(500).json({ error: error.message });
    }
  },

  couponValidity: async (req, res) => {
    try {
      const { email, day, mealType } = req.body;

      if (!email || !day || mealType === undefined) {
        return res.status(400).send({ message: "Email, day, and mealType are required!" });
      }

      const isValid = await CouponService.couponValidity(email, day, mealType);
      return res.json({ isValid });
    } catch (error) {
      console.error("Error in couponValidity:", error);
      res.status(500).json({ error: error.message });
    }
  },

  totalMeals: async (req, res) => {
    try {
      const totalMeals = await CouponService.totalMealCount();
      return res.json(totalMeals);
    } catch (error) {
      console.error("Error in totalMeals:", error);
      res.status(500).json({ error: error.message });
    }
  },

  purchaseCoupon: async (req, res) => {
    const { userId, selected } = req.body;

    if (!userId || !selected) {
      return res.status(400).json({ error: "Id and selected meals are required!" });
    }

    try {
      const existingCoupons = await Coupon.find({ userId }).sort({ createdAt: -1 });
      if (existingCoupons.length >= 2) {
        return res.status(400).json({ error: "You can only have a maximum of 2 coupons." });
      }

      const currentDate = new Date();
      // Allow a new coupon only if 5 days have passed since the last coupon's creation
     if (existingCoupons.length > 0 && (currentDate - existingCoupons[0].createdAt) / (1000 * 60 * 60 * 24) < 5) {
        return res.status(400).json({
        error: "You can only buy a new coupon 5 days after the last purchase",
        });
      }
      
      const newCoupon = new Coupon({userId, week: selected, taken: true});
      await newCoupon.save();
      return res.json({ message: "Coupon purchased successfully!", newCoupon });
    } catch (error) {
      console.error("Error in purchaseCoupon:", error);
      res.status(500).json({ error: error.message });
    }
  },

  scanCoupon: async (req, res) => {
    try {
      const { userId, day, mealType, qrCode } = req.body;
      const result = await CouponService.couponScan(userId, day, mealType, qrCode);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error("Error in scanCoupon:", error);
      res.status(500).json({ error: error.message });
    }
  },
};