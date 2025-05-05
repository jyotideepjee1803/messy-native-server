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
  
  let curr = 0;
  let next = 0;
  for (const coupon of allCoupons) {
    const weekStart = new Date(coupon.weekStartDate);
    const isCurrent = weekStart.getDate() === currentWeekStart.getDate();
    const isNext = weekStart.getDate() === nextWeekStart.getDate();

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

const couponScan = async(couponId, dayIndex, mealType) => {
  try{
      const coupon = await Coupon.findById(couponId);
      if (!coupon) return { success: false, message: "Coupon not found" };

      const {startOfWeek} = getWeekStartAndEndDates(new Date());
      if(startOfWeek.toISOString().split('T')[0] !== coupon.weekStartDate.toISOString().split('T')[0]) {
        return { success: false, message: "You can't scan this week's coupon" };
      }

      const qrKey = `${dayIndex}-${mealType}`;
      const qrData = coupon.qrInfo.get(qrKey);

      const qrCode = `${coupon.userId}-${dayIndex}-${mealType}`

      if (qrData.scanned) {
        console.log("QR used");
        return { success: true, message: "QR Code already used" };
      }

      if (!qrData || qrData.qrCode !== qrCode) {
        console.log("Invalid");
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
