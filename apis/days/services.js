const {Day} = require('../../Models/day');

module.exports = {
    createMenu: async (data) => {
        await Day.deleteMany({})
        const response = await Day.insertMany(data)
        return response;
    },

    getDays: async () => {
        const response = await Day.find({}).select({_id: 0});
        return response;
    },

    updateDay: async (id, data) => {
        const day = await Day.findByIdAndUpdate(id, data, { new: true });
        if (!day) throw { statusCode: 404, message: 'Day not found' };
        return day;
    },

    deleteDay: async (id) => {
        const day = await Day.findByIdAndDelete(id);
        if (!day) throw { statusCode: 404, message: 'Day not found' };
    },
};