const MealService = require('./services');

module.exports = {
    createMeal: async (req, res) => {
        try {
            const day = await MealService.createMeal(req.body.mealData);
            res.status(201).json(day);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    getMeals: async (req, res) => {
        try {
            const days = await MealService.getMeals();
            res.send(days);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    updateMeal: async (req, res) => {
        try {
            const updatedDay = await MealService.updateMeal(req.params.id, req.body);
            res.json(updatedDay);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    deleteMeal: async (req, res) => {
        try {
            await MealService.deleteMeal(req.params.id)
            res.sendStatus(204);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },
};