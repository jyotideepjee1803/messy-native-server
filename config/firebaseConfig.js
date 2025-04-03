const admin = require("firebase-admin");

const serviceAccount = require("./firebase-private-key.json");
const { getMessaging } = require("firebase-admin/messaging");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sendPushNotification = async (tokens, title, body) => {
    const message = {
        data: {
            title,
            body,
        },
        tokens, // Array of FCM tokens
    };

    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(response.successCount + "Push notification sent successfully!");
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
};

module.exports = { sendPushNotification };
