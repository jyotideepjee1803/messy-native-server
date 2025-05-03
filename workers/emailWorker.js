require('dotenv').config();
const { Worker } = require('bullmq');
const Redis = require('ioredis');
const nodemailer = require('nodemailer');

const connection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
});

const emailWorker = new Worker('emailQueue', async (job) => {
  const { email, otp } = job.data;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    secure: false, // Disable TLS/SSL encryption (Insecure)
    port:587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    debug: true,
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
}, { connection });

emailWorker.on('completed', job => {
	console.log(`Job ${job.id} done`);
})

emailWorker.on('failed', (job,err) => {
        console.log(`Job ${job.id} failed: ${err.message}`);
})


console.log('Email Worker running...');
