const nodemailer = require('nodemailer');

// SMTP Transporter — .env se config lega
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,         // e.g. smtp.gmail.com
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ✅ self-signed certificate error fix
  },
});

/**
 * Email bhejne ka generic function
 * @param {string} to        - receiver email
 * @param {string} subject   - email subject
 * @param {string} html      - email HTML body
 */
const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'TheBizIdeas'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to: ${to}`);
  } catch (err) {
    console.error(`❌ Email failed to ${to}:`, err.message);
    // Email fail hone par bhi app crash nahi hogi
  }
};

module.exports = { sendMail };