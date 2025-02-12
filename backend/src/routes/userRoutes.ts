import express from "express";
import authenticateUser from "../middleware/authenticate";
import { authorizeRole } from "../middleware/authorizeRole";
import {
  changePassword,
  getAllUsers,
  getProfile,
  getUserReports,
  login,
  logout,
  requestPasswordReset,
  resetPassword,
  signup,
  toggleBanUser,
  updateProfile,
  requestPhoneVerification,
  verifyPhoneNumber,
} from "../controller/userController";

const userRouter = express.Router();

// User Authentication
// Debugging log to confirm route file is loaded
console.log("✅ userRouter.ts: User routes loaded");

// User Authentication
userRouter.post(
  "/signup",
  // (req, res, next) => {
  //   console.log("✅ Request received at /register");
  //   console.log("✅ Request Body:", req.body);
  //   next();
  // },
  signup
);
userRouter.post("/login", login); //tested and working ✅
userRouter.post("/logout", authenticateUser, logout); //tested and working ✅

// Profile Management
userRouter.get("/profile", authenticateUser, getProfile); //tested and working ✅
userRouter.put("/profile", authenticateUser, updateProfile); //tested and working ✅
userRouter.put("/change-password", authenticateUser, changePassword); //tested and working ✅

// Phone Number Verification
userRouter.post("/request-phone-verification", authenticateUser, requestPhoneVerification);
userRouter.post("/verify-phone", authenticateUser, verifyPhoneNumber);

// reset password

userRouter.post("/forgot-password", requestPasswordReset); //tested and working ✅
userRouter.post("/reset-password", resetPassword); //tested and working ✅

// Admin - Manage Users
userRouter.get(
  "/all-users",
  authenticateUser,
  authorizeRole(["admin"]),
  getAllUsers
); //tested and working ✅
userRouter.post(
  "/ban-user",
  authenticateUser,
  authorizeRole(["admin"]),
  toggleBanUser
); // tested and working ✅

// 📌 Get all crime reports by a user
userRouter.get("/:id/reports", getUserReports); //tested and working ✅

export default userRouter;
