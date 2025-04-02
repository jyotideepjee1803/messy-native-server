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
  const currentWeekCounts = [
    [0, 0, 0, 0, 0, 0, 0], // Breakfast
    [0, 0, 0, 0, 0, 0, 0], // Lunch
    [0, 0, 0, 0, 0, 0, 0], // Dinner
  ];
  const nextWeekCounts = [
    [0, 0, 0, 0, 0, 0, 0], // Breakfast
    [0, 0, 0, 0, 0, 0, 0], // Lunch
    [0, 0, 0, 0, 0, 0, 0], // Dinner
  ];

  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

  // Get the start (Monday) and end (Sunday) of the current week
  const startOfCurrentWeek = new Date(today);
  startOfCurrentWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Move to Monday
  startOfCurrentWeek.setHours(0, 0, 0, 0);

  const endOfCurrentWeek = new Date(startOfCurrentWeek);
  endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 6); // Move to Sunday
  endOfCurrentWeek.setHours(23, 59, 59, 999);

  // Get start and end of next week
  const startOfNextWeek = new Date(endOfCurrentWeek);
  startOfNextWeek.setDate(endOfCurrentWeek.getDate() + 1); // Move to next Monday
  startOfNextWeek.setHours(0, 0, 0, 0);

  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6); // Move to next Sunday
  endOfNextWeek.setHours(23, 59, 59, 999);

  allCoupons.forEach((coupon) => {
    const updatedAt = new Date(coupon.createdAt);

    if (updatedAt >= startOfCurrentWeek && updatedAt <= endOfCurrentWeek) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 7; j++) {
          if (coupon.week[i][j] === true) {
            currentWeekCounts[i][j]++;
          }
        }
      }
    } 
    else if (updatedAt >= startOfNextWeek && updatedAt <= endOfNextWeek) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 7; j++) {
          if (coupon.week[i][j] === true) {
            nextWeekCounts[i][j]++;
          }
        }
      }
    }
  });

  // Format meal counts into a structured object
  const formatWeekCounts = (mealsCount) =>
    mealsCount[0].map((_, index) => ({
      breakfast: mealsCount[0][index],
      lunch: mealsCount[1][index],
      dinner: mealsCount[2][index],
    }));

  return {
    currentWeek: formatWeekCounts(currentWeekCounts),
    nextWeek: formatWeekCounts(nextWeekCounts),
  };
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