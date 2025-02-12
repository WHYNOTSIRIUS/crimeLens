import { Request, Response, NextFunction } from "express";

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, phoneNumber, displayName } = req.body;

  if (!email || !password || !phoneNumber || !displayName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  // Phone number validation (Bangladesh format)
  const phoneRegex = /^(\+8801|8801|01)[3-9]{1}[0-9]{8}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  next();
}; 