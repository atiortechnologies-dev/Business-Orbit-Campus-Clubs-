const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
  const t = getTransporter();

  if (!t) {
    console.log("=== SMTP not configured, logging email instead ===");
    console.log(`To: ${to}\nSubject: ${subject}\n${html}`);
    console.log("===================================================");
    return;
  }

  await t.sendMail({
    from: process.env.SMTP_FROM || "no-reply@example.com",
    to,
    subject,
    html,
  });
};

const sendOTPEmail = async (to, otp) => {
  await sendEmail({
    to,
    subject: "Verify your email",
    html: `<p>Your email verification code is:</p>
           <h2>${otp}</h2>
           <p>This code expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>`,
  });
};

module.exports = { sendEmail, sendOTPEmail };
