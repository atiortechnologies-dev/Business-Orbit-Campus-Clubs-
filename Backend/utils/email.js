/**
 * @file email.js
 * @description Provides utility functions and configurations for dispatching transactional emails (e.g., via Nodemailer).
 * @architecture Encapsulates the third-party email provider logic, presenting a clean interface to controllers.
 */

/**
 * Goal: Provides utility functions for sending emails.
 * Architecture relevance: Abstracts the email sending service (e.g., Nodemailer). It is used across the application for tasks like sending verification links or password reset emails.
 */
const Nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

// Initialize SMTP transport (Using Mailtrap Sandbox for development)
const transport = Nodemailer.createTransport({
  host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Generate a cryptographically secure 6-digit OTP
 * @returns {string} - A 6-digit string
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generic email sending function
 * @param {Object} options
 * @param {string} options.toEmail
 * @param {string} options.subject
 * @param {string} options.htmlContent
 * @param {string} [options.category="Notification"]
 * @returns {Promise<any>}
 */
const sendEmail = async ({
  toEmail,
  subject,
  htmlContent,
  category = "Notification",
}) => {
  const sender = {
    address: "hello@demomailtrap.co",
    name: "BOCC Auth System (Test)",
  };

  const emailOptions = {
    from: sender,
    to: [toEmail],
    subject,
    html: htmlContent,
    category,
  };

  try {
    const info = await transport.sendMail(emailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email via Mailtrap:", error);
    throw error;
  }
};

/**
 * Sends an email with OTP for verification
 * @param {string} toEmail - The recipient's email address
 * @param {string} otp - The 6-digit OTP
 * @param {Object} [options] - Custom text options for the OTP email
 * @param {string} [options.subject="BOCC - Verify Your Email"]
 * @param {string} [options.headerText="Email Verification"]
 * @param {string} [options.descriptionText="Welcome to Business Orbit Campus Clubs (BOCC)! Please verify your email address to complete your registration."]
 * @returns {Promise<any>}
 */
const sendOTPEmail = async (
  toEmail,
  otp,
  {
    subject = "BOCC - Verify Your Email",
    headerText = "Email Verification",
    descriptionText = "Welcome to Business Orbit Campus Clubs (BOCC)! Please verify your email address to complete your registration.",
  } = {},
) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>${headerText}</h2>
      <p>${descriptionText}</p>
      <p>Please use the following 6-digit OTP. This OTP is valid for <strong>15 minutes</strong>.</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff; background: #f4f4f4; padding: 15px 30px; border-radius: 8px;">${otp}</span>
      </div>
      <p>If you did not request this, you can safely ignore this email.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #888; font-size: 12px;">This is an automated test email sent via Mailtrap.</p>
    </div>
  `;

  return sendEmail({
    toEmail,
    subject,
    htmlContent,
    category: "Email Verification",
  });
};

const sendAdminMeetingReminder = async (
  adminEmail,
  {
    startupName,
    studentName,
    reviewerName,
    meetingDate,
    meetingTime,
    duration,
    platform,
    agenda,
  },
) => {
  const subject = `[BCOC Internal] Meeting Reminder: ${startupName} with ${reviewerName}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2 style="color: #111; margin-bottom: 10px;">BCOC Internal Meeting Notification</h2>
      <p style="color: #444; font-size: 15px; line-height: 1.5;">
        A review meeting has been scheduled in the system. Here are the summary details for admin records:
      </p>

      <div style="background-color: #f9f9f9; padding: 15px 20px; border-radius: 6px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 140px;">Startup Name:</td>
            <td style="padding: 6px 0;">${startupName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Student / Founder:</td>
            <td style="padding: 6px 0;">${studentName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Assigned Reviewer:</td>
            <td style="padding: 6px 0;">${reviewerName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Date & Time:</td>
            <td style="padding: 6px 0;">${meetingDate} at ${meetingTime}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Duration:</td>
            <td style="padding: 6px 0;">${duration}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Platform:</td>
            <td style="padding: 6px 0;">${platform}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Agenda:</td>
            <td style="padding: 6px 0;">${agenda || "N/A"}</td>
          </tr>
        </table>
      </div>

      <p style="color: #666; font-size: 12px; text-align: center;">
        Business Orbit Campus Clubs (BCOC) — Internal System Notification
      </p>
    </div>
  `;

  return sendEmail({
    toEmail: adminEmail,
    subject,
    htmlContent,
    category: "Admin Meeting Reminder",
  });
};

module.exports = {
  generateOTP,
  sendEmail,
  sendOTPEmail,
  sendAdminMeetingReminder,
};
