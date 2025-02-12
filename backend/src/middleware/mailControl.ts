import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import { config } from "../config/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email_user,
    pass: config.email_password,
  },
});

interface EmailOptions {
  subject: string;
  text: string;
  to: string;
  hmtl?: string;
}

export const sendMail = async (
  options: EmailOptions,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await transporter.sendMail({
      from: config.email_user,
      ...options,
    });
  } catch (error) {
    next(error);
  }
}; 