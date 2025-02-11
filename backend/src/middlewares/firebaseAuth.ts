import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";
import createHttpError from "http-errors";

/**
 * ✅ Middleware to send OTP to the user's phone number using Firebase Authentication.
 */
export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return next(createHttpError(400, "Phone number is required"));
    }

    // ✅ Generate a Firebase phone authentication session
    const session = await admin.auth().createSessionCookie(phoneNumber, {
      expiresIn: 10 * 60 * 1000, // OTP expires in 10 minutes
    });

    res.status(200).json({
      message: "OTP sent successfully",
      session,
    });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    next(createHttpError(500, "Failed to send OTP"));
  }
};

/**
 * ✅ Middleware to verify the OTP entered by the user.
 */
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return next(createHttpError(400, "Phone number and OTP are required"));
    }

    // ✅ Verify the OTP using Firebase Authentication
    const decodedToken = await admin.auth().verifyIdToken(otp);

    if (
      !decodedToken.phone_number ||
      decodedToken.phone_number !== phoneNumber
    ) {
      return next(createHttpError(400, "Invalid or expired OTP"));
    }

    res.status(200).json({
      message: "Phone number verified successfully",
      phoneNumber,
    });
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    next(createHttpError(400, "Invalid or expired OTP"));
  }
};
