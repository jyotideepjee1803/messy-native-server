const { Coupon } = require('../../Models/coupon');

// Validate coupon validity
const couponValidity = async (email, day, mealType) => {
  const student = await Coupon.findOne({ email });

  if (student && student.week[mealType][day] === true) {
    return true;
  }
  return false;
};

// Count total meals for the week
const totalMealCount = async () => {
  const allCoupons = await Coupon.find({});
  const mealsCount = [
    [0, 0, 0, 0, 0, 0, 0], // Breakfast
    [0, 0, 0, 0, 0, 0, 0], // Lunch
    [0, 0, 0, 0, 0, 0, 0], // Dinner
  ];

  const today = new Date();

  allCoupons.forEach((coupon) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 7; j++) {
        const updatedAt = new Date(coupon.updatedAt);
        const dayDifference = Math.ceil((today - updatedAt) / (1000 * 60 * 60 * 24));

        if (coupon.week[i][j] === true && dayDifference <= 7) {
          mealsCount[i][j]++;
        }
      }
    }
  });

  // Format meals into a user-friendly object
  const totalMeals = mealsCount[0].map((_, index) => ({
    breakfast: mealsCount[0][index],
    lunch: mealsCount[1][index],
    dinner: mealsCount[2][index],
  }));

  return totalMeals;
};

// Purchase or update a coupon
const couponPurchase = async (userId, selected) => {
  const result = await Coupon.updateOne(
    { userId },
    { $set: { week: selected, taken: true } },
    { upsert: true }
  );

  return result;
};

const couponScan = async(userId, dayIndex, mealType, qrCode) => {
  try{
      const coupon = await Coupon.findOne({ userId});
      if (!coupon) return { success: false, message: "Coupon not found" };

      const qrKey = `${dayIndex}-${mealType}`;
      const qrData = coupon.qrInfo.get(qrKey);

      if (qrData.scanned) {
        return { success: true, message: "QR Code already used" };
      }

      if (!qrData || qrData.qrCode !== qrCode) {
        return { success: false, message: "Invalid QR Code" };
      }

      qrData.scanned = true;
      coupon.qrInfo.set(qrKey, qrData);
      coupon.week[mealType === "breakfast" ? 0 : mealType === "lunch" ? 1 : 2][dayIndex] = false;

      await coupon.save();

      return { success: true, message: "Coupon redeemed successfully!" };
  } catch (error) {
      console.error("Error scanning QR:", error);
      return { success: false, message: "Internal Server Error" };
  }

}

module.exports = {
  couponValidity,
  totalMealCount,
  couponPurchase,
  couponScan,
};