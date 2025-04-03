const { sendPushNotification } = require("../../config/firebaseConfig");
const { Notice } = require("../../Models/notice");
const { User} = require("../../Models/user");

module.exports = {
    createNotice: async (data) => {
        const notice = new Notice(data);
        await notice.save();

        const users = await User.find({fcmToken: {$ne: null}});
        const userFCMTokens = users.map(user => user.fcmToken);

        
        await sendPushNotification(
            userFCMTokens,
            data.subject,
            data.body,
        );
            
        return notice;
    },

    getNotices: async () => {
        return await Notice.find();
    },

    updateNotice: async (id, data) => {
        const notice = await Notice.findByIdAndUpdate(id, data, { new: true });
        if (!notice) throw { statusCode: 404, message: 'Notice not found' };
        return notice;
    },

    deleteNotice: async (id) => {
        const notice = await Notice.findByIdAndDelete(id);
        if (!notice) throw { statusCode: 404, message: 'Notice not found' };
    },
};