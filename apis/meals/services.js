const {Meal} = require('../../Models/meal');

module.exports = {
    createMeal: async (data) => {
        await Meal.deleteMany({});
        const response = await Meal.insertMany(data);
        return response;
    },

    getMeals: async () => {
        const response = await Meal.find({}).select({_id: 0});
        return response;
    },

    updateMeal: async (id, data) => {
        const day = await Meal.findByIdAndUpdate(id, data, { new: true });
        if (!day) throw { statusCode: 404, message: 'Meal not found' };
        return day;
    },

    deleteMeal: async (id) => {
        const day = await Meal.findByIdAndDelete(id);
        if (!day) throw { statusCode: 404, message: 'Meal not found' };
    },
};