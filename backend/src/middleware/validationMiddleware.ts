import { Request, Response, NextFunction } from "express";

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { displayName, email, password, phoneNumber } = req.body;

  if (!displayName || !email || !password || !phoneNumber) {
    return res.status(400).json({ 
      message: "All fields are required: displayName, email, password, phoneNumber" 
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Phone validation (Bangladeshi format)
  const phoneRegex = /^(?:\+88|01)?\d{9,11}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }

  // Password validation
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
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