import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/userModel";

interface AuthRequest extends Request {
  user?: IUser;
}

export const requireFullVerification = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      message: "Please verify your email address",
      verificationNeeded: "email",
    });
  }

  if (!req.user.isPhoneVerified) {
    return res.status(403).json({
      message: "Please verify your phone number",
      verificationNeeded: "phone",
    });
  }

  next();
}; 