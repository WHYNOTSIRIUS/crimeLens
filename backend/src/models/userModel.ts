import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  phoneNumber: string;
  displayName: string;
  isVerified: boolean;
  role: "unverified" | "verified" | "admin";
  profileImage?: string;
  bio?: string;
  contactInfo?: string;
  isBanned: boolean; // ✅ Added isBanned field
  resetOtp?: string; // ✅ Added OTP field
  resetOtpExpiry?: number; // ✅ Added OTP Expiry field
}

const userSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["unverified", "verified", "admin"],
      default: "unverified",
    },
    profileImage: { type: String, required: true },
    bio: { type: String },
    contactInfo: { type: String },
    isBanned: { type: Boolean, default: false }, // ✅ Default is false
    resetOtp: { type: String, default: null }, // ✅ OTP for password reset
    resetOtpExpiry: { type: Number, default: null }, // ✅ OTP Expiry timestamp
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
