const NoticeService = require('./services');

module.exports = {
    createNotice: async (req, res) => {
        try {
            const notice = await NoticeService.createNotice(req.body);
            res.status(201).json(notice);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    getNotices: async (req, res) => {
        try {
            const notices = await NoticeService.getNotices();
            res.json(notices);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    updateNotice: async (req, res) => {
        try {
            const updatedNotice = await NoticeService.updateNotice(req.params.id, req.body);
            res.json(updatedNotice);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    deleteNotice: async (req, res) => {
        try {
            await NoticeService.deleteNotice(req.params.id);
            res.sendStatus(204);
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },
};