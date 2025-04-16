const getWeekStartAndEndDates = (inputDate) => {
    const date = new Date(inputDate); // Clone the input date to avoid mutation
    const day = date.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const diffToMonday = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days, else move to Monday
  
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0); // Set to start of the day
  
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999); // Set to end of the day
  
    return { startOfWeek, endOfWeek };
};

module.exports = {getWeekStartAndEndDates};