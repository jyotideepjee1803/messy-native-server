const { Coupon } = require('../../Models/coupon');
const { getWeekStartAndEndDates } = require('../../utils/weekRange');
const CouponService = require('./services');

module.exports = {
  userCoupon: async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).send({ message: "User ID is required!" });
    }
    try {
      // Get current date and calculate current and next week ranges
      const currentDate = new Date();
      const { startOfWeek: currentWeekStart, endOfWeek: currentWeekEnd } = getWeekStartAndEndDates(currentDate);
      const { startOfWeek: nextWeekStart, endOfWeek: nextWeekEnd } = getWeekStartAndEndDates(new Date(currentDate.setDate(currentDate.getDate() + 7)));
      // console.log(currentWeekStart, currentWeekEnd, nextWeekStart, nextWeekEnd);
      // Fetch coupons from the database
      const coupons = await Coupon.find({ userId }).select({ _id: 0 }).sort({ weekStartDate: -1 });
      
      // Filter coupons for current and next week
      // const validCoupons = coupons.filter((coupon) => {
      //   const createdAt = new Date(coupon.createdAt);
      //   // Check if coupon's created date is within the current or next week
      //   return (createdAt >= currentWeekStart && createdAt <= currentWeekEnd) || (createdAt >= nextWeekStart && createdAt <= nextWeekEnd);
      // });
  
      // Only return at most one coupon for each week
      const currentWeekCoupon = coupons.find(coupon => new Date(coupon.weekStartDate).getTime() === currentWeekStart.getTime());
      const nextWeekCoupon = coupons.find(coupon => new Date(coupon.weekStartDate).getTime() === nextWeekStart.getTime());
  
      const responseCoupons = [];
      if (currentWeekCoupon) responseCoupons.push(currentWeekCoupon);
      if (nextWeekCoupon) responseCoupons.push(nextWeekCoupon);
  
      res.json({ coupons: responseCoupons });
  
    } catch (error) {
      console.error("Error in userCoupon:", error);
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

  scanCoupon: async (req, res) => {
    try {
      const { userId, dayIndex, mealType } = req.body;
      const qrCode = `${userId}-${dayIndex}-${mealType}`;

      const currentDayIndex = new Date().getDay() - 1; // Adjusting for week starting from Monday
      if (currentDayIndex === -1) currentDayIndex = 6; // Adjust Sunday to index 6

      // Ensure scanning is only possible for the correct day
      if (currentDayIndex !== parseInt(dayIndex, 10)) {
          return res.status(400).json({ success: false, message: "You can only scan today's coupon." });
      }

      const result = await CouponService.couponScan(userId, dayIndex, mealType, qrCode);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error("Error in scanCoupon:", error);
      res.status(500).json({ error: error.message });
    }
  },
};