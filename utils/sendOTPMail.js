const emailQueue = require("../queue/emailQueue");

const sendOtpEmail = async (email, otp) => {
  await emailQueue.add('send-otp',{
    email,
    otp,
  });
};

module.exports = sendOtpEmail;
