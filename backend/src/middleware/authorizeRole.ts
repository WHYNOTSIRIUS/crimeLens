import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import User from "../models/userModel";

export const authorizeRole = (allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions" });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
}; 