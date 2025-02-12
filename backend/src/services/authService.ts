import bcrypt from "bcryptjs";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
import { sendSMS } from "./twilioService";
import { generateOTP } from "../utils/otpUtils";
import { EmailService } from "./emailService";

export class AuthService {
  private static JWT_SECRET: Secret = process.env.JWT_SECRET!;
  private static JWT_EXPIRES_IN = process.env.NODE_ENV === 'development' ? '7d' : '1d';

  static async register(userData: {
    email: string;
    password: string;
    phoneNumber: string;
    displayName: string;
    profileImage: string;
  }) {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { phoneNumber: userData.phoneNumber }],
    });

    if (existingUser) {
      throw new Error("User already exists with this email or phone number");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Generate phone verification OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = await User.create({
      ...userData,
      password: hashedPassword,
      phoneVerificationOtp: otp,
      phoneVerificationExpiry: otpExpiry,
      isEmailVerified: false,
      isPhoneVerified: false,
      role: "unverified"
    });

    // Send OTP via SMS
    await sendSMS(
      userData.phoneNumber,
      `Your verification code is: ${otp}. Valid for 10 minutes.`
    );

    // Send verification email
    await EmailService.sendVerificationEmail(user.email, user._id.toString());

    return user;
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email }) as IUser;
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    if (user.isBanned) {
      throw new Error("Your account has been banned. Please contact support.");
    }

    const accessToken = this.generateAccessToken(user._id.toString());
    const refreshToken = this.generateRefreshToken(user._id.toString());
    
    // Update user
    user.lastLogin = new Date();
    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  }

  static async verifyPhone(phoneNumber: string, otp: string) {
    const user = await User.findOne({
      phoneNumber,
      phoneVerificationOtp: otp,
      phoneVerificationExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new Error("Invalid or expired OTP");
    }

    user.isPhoneVerified = true;
    user.phoneVerificationOtp = undefined;
    user.phoneVerificationExpiry = undefined;
    
    if (user.role === "unverified") {
      user.role = "verified";
    }

    await user.save();
    return user;
  }

  static async requestPasswordReset(emailOrPhone: string) {
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.passwordResetOtp = otp;
    user.passwordResetExpiry = otpExpiry;
    await user.save();

    // Send OTP via SMS if phone number provided
    if (emailOrPhone === user.phoneNumber) {
      await sendSMS(
        user.phoneNumber,
        `Your password reset code is: ${otp}. Valid for 10 minutes.`
      );
    } else {
      // TODO: Implement email sending
      console.log("Send email with OTP:", otp);
    }

    return true;
  }

  static async resetPassword(emailOrPhone: string, otp: string, newPassword: string) {
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
      passwordResetOtp: otp,
      passwordResetExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new Error("Invalid or expired OTP");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordResetOtp = undefined;
    user.passwordResetExpiry = undefined;
    await user.save();

    return true;
  }

  static async refreshToken(refreshToken: string) {
    const user = await User.findOne({ refreshToken });
    if (!user) {
      throw new Error("Invalid refresh token");
    }

    const accessToken = this.generateAccessToken(user._id.toString());
    return { accessToken };
  }

  static async verifyEmail(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as {
        userId: string;
        type: string;
      };

      if (decoded.type !== "email-verification") {
        throw new Error("Invalid token type");
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error("User not found");
      }

      user.isEmailVerified = true;
      await user.save();

      return user;
    } catch (error) {
      throw new Error("Invalid or expired verification token");
    }
  }

  private static generateAccessToken(userId: string) {
    return jwt.sign(
      { userId }, 
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN } as SignOptions
    );
  }

  private static generateRefreshToken(userId: string) {
    return jwt.sign(
      { userId, type: "refresh" }, 
      this.JWT_SECRET,
      { expiresIn: "30d" }
    );
  }
} 