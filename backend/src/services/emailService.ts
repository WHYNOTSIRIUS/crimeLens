import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export class EmailService {
  private static transporter = nodemailer.createTransport({
    // Configure your email service
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  static async sendVerificationEmail(email: string, userId: string) {
    const token = jwt.sign(
      { userId, type: "email-verification" },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
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