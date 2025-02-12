import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
export class EmailService {
  private static transporter = nodemailer.createTransport({
    // Configure your email service
    service: "gmail",
    auth: {
      user: config.email_user,
      pass: config.email_password,
    },
  });

  static async sendVerificationEmail(email: string, userId: string) {
    const token = jwt.sign(
      { userId, type: "email-verification" },
      config.jwtSecret!,
      { expiresIn: "24h" }
    );

    const verificationLink = `${config.frontend_url}/verification/email?token=${token}`;

    const mailOptions = {
      from: config.email_user,
      to: email,
      subject: "Verify Your Email - CrimeLens",
      html: `
        <h1>Welcome to CrimeLens</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
} 