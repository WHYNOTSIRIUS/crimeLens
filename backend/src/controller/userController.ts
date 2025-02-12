/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import crypto from "crypto";
import User from "../models/userModel";
import { AuthRequest } from "../types/AuthRequest";
import { config } from "../config/config"; // Ensure JWT secret is stored securely
import mongoose from "mongoose";

import CrimeReport from "../models/crimeReportModel";
import { sendMail } from "../middlewares/mailControl";
import { sendOtp, verifyOtp } from "../service/twilloService";

// Helper function to generate JWT token
const generateToken = (userId: string) => {
  if (!config.jwtSecret) {
    throw new Error("JWT secret is not defined");
  }
  return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: "7d" });
};

/**
 * @desc Register a new user
 * @route POST /api/users/register
 */

/**
 * @desc User Signup with Phone Number Validation
 * @route POST /api/users/signup
 */
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, displayName, phoneNumber, bio, contactInfo } =
      req.body;

    // ✅ Extract profileImage from Cloudinary upload
    const profileImage = req.body.profileImage;

    // ✅ Check if profileImage exists
    if (!profileImage) {
      return next(createHttpError(400, "Profile image is required."));
    }

    // ✅ 1️⃣ Validate Email Format
    if (!email || !/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return next(createHttpError(400, "Invalid email format"));
    }

    // ✅ 2️⃣ Validate Phone Number Format
    const phoneRegex = /^(?:\+88|01)?\d{9,11}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      return next(
        createHttpError(400, "Invalid Bangladeshi phone number format.")
      );
    }

    // ✅ 3️⃣ Check if Email or Phone Number Already Exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existingUser) {
      return next(
        createHttpError(400, "Email or phone number already registered")
      );
    }

    // ✅ 4️⃣ Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ 5️⃣ Create New User
    const newUser = new User({
      email,
      password: hashedPassword,
      displayName,
      phoneNumber,
      profileImage, // ✅ Cloudinary URL stored here
      bio: bio || "",
      contactInfo: contactInfo || "",
      isVerified: false,
      role: "unverified",
      isBanned: false,
    });

    await newUser.save();

    // ✅ 6️⃣ Return Success Response
    res.status(201).json({
      message: "User registered successfully. Please verify your phone number.",
      user: {
        id: newUser._id,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        isVerified: newUser.isVerified,
        role: newUser.role,
        isBanned: newUser.isBanned,
        profileImage: newUser.profileImage,
        bio: newUser.bio,
        contactInfo: newUser.contactInfo,
      },
    });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    next(createHttpError(500, "Internal Server Error"));
  }
};

/**
 * @desc Login user
 * @route POST /api/users/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(401, "Invalid email or password"));
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(401, "Invalid email or password"));
    }

    // Generate JWT token
    const token = generateToken((user._id as string).toString());

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

/**
 * @desc Logout user (Token-based logout)
 * @route POST /api/users/logout
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

/**
 * @desc Get user profile
 * @route GET /api/users/profile
 */

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("✅ getProfile - User ID from req:", req.userId); // Debugging log

    if (!req.userId) {
      return next(createHttpError(401, "Unauthorized: Missing user ID"));
    }

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    res.status(200).json(user);
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

/**
 * @desc Update user profile
 * @route PUT /api/users/profile
 */
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { displayName, profileImage, bio, contactInfo } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { displayName, profileImage, bio, contactInfo },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return next(createHttpError(404, "User not found"));
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

/**
 * @desc Verify phone number (Admin not required)
 * @route POST /api/users/verify-phone
 */
// export const verifyPhone = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { phoneNumber } = req.body;

//     const user = await User.findOne({ phoneNumber });
//     if (!user) {
//       return next(createHttpError(404, "User not found"));
//     }

//     user.isVerified = true;
//     await user.save();

//     res.status(200).json({ message: "Phone number verified successfully" });
//   } catch (error) {
//     next(createHttpError(500, "Internal Server Error"));
//   }
// };

/**
 * @desc Get all users (Admin Only)
 * @route GET /api/users/all-users
 */
export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

/**
 * @desc Ban/Unban a user (Admin Only)
 * @route POST /api/users/ban-user
 */
export const toggleBanUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, isBanned } = req.body;
    console.log("✅ toggleBanUser - Received User ID:", userId); // Debugging log

    // ✅ Ensure userId is a valid ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("❌ Invalid ObjectId format");
      return next(createHttpError(400, "Invalid User ID format"));
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    // ✅ Find user using the converted ObjectId
    const user = await User.findById(objectId);

    if (!user) {
      console.log("❌ User not found in database");
      return next(createHttpError(404, "User not found"));
    }

    user.isBanned = isBanned;
    await user.save();

    console.log(`✅ User ${isBanned ? "banned" : "unbanned"} successfully`);

    res
      .status(200)
      .json({ message: `User has been ${isBanned ? "banned" : "unbanned"}` });
  } catch (error) {
    console.error("❌ toggleBanUser Error:", error);
    next(createHttpError(500, "Internal Server Error"));
  }
};

/// Crime Reports of a User

export const getUserReports = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params; // User ID from URL

    // ✅ Fetch all reports where user ID matches
    const reports = await CrimeReport.find({ user: id }).sort({
      createdAt: -1,
    });

    if (!reports || reports.length === 0) {
      return next(createHttpError(404, "No reports found for this user"));
    }

    res.status(200).json(reports);
  } catch (error) {
    console.error("❌ getUserReports Error:", error);
    next(createHttpError(500, "Internal Server Error"));
  }
};

// Change Password
export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return next(
        createHttpError(400, "Both old and new passwords are required")
      );
    }

    // Find the user
    const user = await User.findById(req.userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return next(createHttpError(400, "Incorrect old password"));
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

/**
 * @desc Request Password Reset (Send OTP)
 * @route POST /api/auth/forgot-password
 * @access Public
 */

/**
 * @desc Request Password Reset (Send OTP)
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(createHttpError(400, "Email is required"));
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    // Store OTP in the database
    user.resetOtp = otp;
    user.resetOtpExpiry = otpExpiry;
    await user.save();

    console.log("✅ Generated OTP:", otp, " for user:", email);

    // Send OTP via email
    await sendMail(
      {
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
        to: user.email,
        hmtl: `<p>Your OTP for password reset is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
      },
      req,
      res,
      next
    );

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    next(createHttpError(500, "Internal Server Error"));
  }
};

/**
 * @desc Verify OTP and Reset Password
 * @route POST /api/auth/reset-password
 * @access Public
 */
/**
 * @desc Verify OTP and Reset Password
 * @route POST /api/auth/reset-password
 * @access Public
 */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return next(
        createHttpError(400, "Email, OTP, and new password are required")
      );
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.error("❌ User not found for email:", email);
      return next(createHttpError(404, "User not found"));
    }

    // Debugging logs
    // console.log("🔍 Checking OTP for user:", email);
    // console.log("Stored OTP in DB:", user.resetOtp);
    // console.log("Received OTP from request:", otp);
    // console.log("Stored OTP Expiry:", user.resetOtpExpiry);
    // console.log("Current Time:", Date.now());

    // Check if OTP is correct and not expired
    if (
      !user.resetOtp ||
      user.resetOtp !== otp ||
      !user.resetOtpExpiry ||
      Date.now() > user.resetOtpExpiry
    ) {
      console.error("❌ Invalid or expired OTP");
      return next(createHttpError(400, "Invalid or expired OTP"));
    }

    // Hash new password
    // console.log("🔒 Hashing new password...");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and remove OTP
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;

    // console.log("✅ Password updated successfully for user:", email);

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("❌ Error resetting password:", error);
    next(createHttpError(500, "Internal Server Error"));
  }
};

export const requestPhoneVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return next(createHttpError(400, "Phone number is required"));
    }

    // Check if the user exists
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    if (user.isVerified) {
      return next(createHttpError(400, "User is already verified"));
    }

    // Send OTP via Twilio
    await sendOtp(phoneNumber);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Error requesting phone verification:", error);
    next(createHttpError(500, "Internal Server Error"));
  }
};

export const verifyPhone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return next(createHttpError(400, "Phone number and OTP are required"));
    }

    // Check if the user exists
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    if (user.isVerified) {
      return next(createHttpError(400, "User is already verified"));
    }

    // Verify OTP
    const isValidOtp = await verifyOtp(phoneNumber, otp);
    if (!isValidOtp) {
      return next(createHttpError(400, "Invalid or expired OTP"));
    }

    // Mark user as verified
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Phone number verified successfully" });
  } catch (error) {
    console.error("❌ Error verifying phone number:", error);
    next(createHttpError(500, "Internal Server Error"));
  }
};
