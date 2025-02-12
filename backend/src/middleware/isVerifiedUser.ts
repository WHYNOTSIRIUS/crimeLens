import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import User from "../models/userModel";

const isVerifiedUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isEmailVerified || !user.isPhoneVerified) {
      return res.status(403).json({ 
        message: "Please verify both your email and phone number to perform this action" 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default isVerifiedUser; 