const { Coupon } = require('../../Models/coupon');
const { getWeekStartAndEndDates } = require('../../utils/weekRange');

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
  
  // Initialize meal counters: [breakfast][days], [lunch][days], [dinner][days]
  const currentWeekCounts = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];

  const nextWeekCounts = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];

  const currentDate = new Date();
  const { startOfWeek: currentWeekStart, endOfWeek: currentWeekEnd } = getWeekStartAndEndDates(currentDate);
  const { startOfWeek: nextWeekStart, endOfWeek: nextWeekEnd } = getWeekStartAndEndDates(new Date(currentDate.setDate(currentDate.getDate() + 7)));
  console.log(currentWeekStart, nextWeekStart);
  let curr = 0;
  let next = 0;
  for (const coupon of allCoupons) {
    const weekStart = new Date(coupon.weekStartDate);
    const isCurrent = weekStart.getDay() === currentWeekStart.getDay();
    const isNext = weekStart.getDay() === nextWeekStart.getDay();

    if (isCurrent || isNext) {
      const targetCounts = isCurrent ? currentWeekCounts : nextWeekCounts;
      isCurrent && curr++;
      isNext && next++;
      for (let meal = 0; meal < 3; meal++) {
        for (let day = 0; day < 7; day++) {
          if (coupon.week[meal][day] === true) {
            targetCounts[meal][day]++;
          }
        }
      }
    }
  }
  console.log(curr, next);
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