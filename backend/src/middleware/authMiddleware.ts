import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../models/userModel";
import User from "../models/userModel";

interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtCustomPayload extends JwtPayload {
  userId: string;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as JwtCustomPayload;
    const user = await User.findOne({
      _id: decoded.userId,
      isBanned: false,
    });

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Please authenticate" });
  }
};

export const verifiedOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role === "unverified") {
    return res.status(403).json({
      message: "Please verify your phone number to access this feature",
    });
  }
  next();
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }
  next();
}; 