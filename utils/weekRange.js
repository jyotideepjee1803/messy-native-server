const getWeekStartAndEndDates = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate());
    const dayOfWeek = startOfWeek.getDay(); // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
  
    // Adjust the date to Monday (start of the week)
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If it's Sunday (0), adjust to previous Monday (-6)
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0); // Set to start of day
  
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week (Sunday)
    endOfWeek.setHours(23, 59, 59, 999); // Set to end of day
  
    return { startOfWeek, endOfWeek };
};

module.exports = {getWeekStartAndEndDates};