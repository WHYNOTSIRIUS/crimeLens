import bcrypt from "bcryptjs";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
import { sendOtp, verifyOtp } from "./twilioService";
import { generateOTP } from "../utils/otpUtils";
import { EmailService } from "./emailService";
import { config } from "../config/config";

export class AuthService {
  private static JWT_SECRET: Secret = config.jwtSecret!;
  private static JWT_EXPIRES_IN = config.env === 'development' ? '7d' : '1d';

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

    // Create user
    const user = await User.create({
      ...userData,
      password: hashedPassword,
      isEmailVerified: false,
      isPhoneVerified: false,
      role: "unverified"
    });

    // Send verification email only
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

  static async verifyPhone(code: string, token: string) {
    // Get user by ID
    const decoded = jwt.verify(token, config.jwtSecret!) as {
      userId: string;
      };
    console.log(decoded,"decoded")
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify OTP
    const isValid = await verifyOtp(user.phoneNumber, code);
    if (!isValid) {
      throw new Error("Invalid or expired verification code");
    }

    // Update user status
    user.isPhoneVerified = true;
    if (user.isEmailVerified) {
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
      await sendOtp(user.phoneNumber);
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
      const decoded = jwt.verify(token, config.jwtSecret!) as {
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

      // Send OTP only after email is verified
      await sendOtp(user.phoneNumber);

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