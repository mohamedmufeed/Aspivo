import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "../logger";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your One-Time Password (OTP) for Secure Verification",
    html: `
      <p><strong>Hello,</strong></p>
      <p>Your one-time password (OTP) for verification is:</p>
      <h2 style="color: #FF6B00; ">${otp}</h2>
      <p>This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <br/>
      <p>Best regards,</p>
      <p><strong>Aspivo Support Team</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`OTP  sent to ${email}, otp ${otp}`)
  } catch (error) {
    logger.error("Error sending OTP:", error)
  }
};

export const resendOtpMail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your New OTP for Secure Verification",
    html: `
   <p><strong>Hello,</strong></p>
<p>We noticed you requested a new OTP for verification. Your new one-time password (OTP) is:</p>
<h2 style="color: #FF6B00; ">${otp}</h2>
<p><strong>⚠ This OTP is valid for only 5 minutes.</strong> Please do not share it with anyone for security reasons.</p>
<p>If you did not request this OTP, please ignore this email. Your account security remains intact.</p>
<hr/>
   <p>If you experience any issues, feel free to contact our support team.</p>
  <p>Best regards,</p>  
   <p><strong>Aspivo Support Team</strong></p>  
`,
  };
  try {
    await transporter.sendMail(mailOptions);
    logger.info(`OTP resneded to ${email} , OTP is ${otp}`)
  } catch (error) {
    logger.error("Error sending OTP:", error)
  }
};
