import express from "express";
import { AuthService } from "../services/authService";
import { upload } from "../middleware/uploadMiddleware";
import { validateRegistration, validateLogin } from "../middleware/validationMiddleware";

interface CustomError extends Error {
  message: string;
  code?: number;
}

const router = express.Router();

router.post("/register", upload.single("profileImage"), validateRegistration, async (req, res) => {
  try {
    const userData = {
      ...req.body,
      profileImage: req.file?.path || "",
    };
    const user = await AuthService.register(userData);
    res.status(201).json({
      message: "Registration successful. Please verify your phone number.",
      user,
    });
  } catch (error) {
    const err = error as CustomError;
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (error) {
    const err = error as CustomError;
    res.status(401).json({ message: err.message });
  }
});

router.post("/verify-phone", async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const user = await AuthService.verifyPhone(phoneNumber, otp);
    res.json({
      message: "Phone number verified successfully",
      user,
    });
  } catch (error) {
    const err = error as CustomError;
    res.status(400).json({ message: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { emailOrPhone } = req.body;
    await AuthService.requestPasswordReset(emailOrPhone);
    res.json({
      message: "Password reset instructions sent successfully",
    });
  } catch (error) {
    const err = error as CustomError;
    res.status(400).json({ message: err.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { emailOrPhone, otp, newPassword } = req.body;
    await AuthService.resetPassword(emailOrPhone, otp, newPassword);
    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    const err = error as CustomError;
    res.status(400).json({ message: err.message });
  }
});

router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await AuthService.refreshToken(refreshToken);
    res.json(result);
  } catch (error) {
    const err = error as CustomError;
    res.status(401).json({ message: err.message });
  }
});

router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await AuthService.verifyEmail(token);
    res.json({
      message: "Email verified successfully. Please verify your phone number.",
      user,
    });
  } catch (error) {
    const err = error as CustomError;
    res.status(400).json({ message: err.message });
  }
});

export default router; 