const nodemailer = require("nodemailer");

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Login",
    html: `
      <h3>OTP Verification</h3>
      <p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 5 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;
