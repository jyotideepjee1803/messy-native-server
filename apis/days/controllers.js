const DayService = require('./services');

module.exports = {
    createMenu: async (req, res) => {
        try {
            const day = await DayService.createMenu(req.body.menuData);
            res.status(201).json(day);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    getDays: async (req, res) => {
        try {
            const days = await DayService.getDays();
            res.send(days);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    updateDay: async (req, res) => {
        try {
            const updatedDay = await DayService.updateDay(req.params.id, req.body);
            res.json(updatedDay);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    deleteDay: async (req, res) => {
        try {
            await DayService.deleteDay(req.params.id);
            res.sendStatus(204);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },
};