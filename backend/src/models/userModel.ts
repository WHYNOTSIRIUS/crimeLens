import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  // Required fields
  email: string;
  password: string;
  phoneNumber: string;
  displayName: string;
  profileImage: string;
  
  // Authentication & Verification
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  phoneVerificationOtp?: string;
  phoneVerificationExpiry?: Date;
  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;
  passwordResetOtp?: string;
  passwordResetExpiry?: Date;
  refreshToken?: string;
  
  // Role & Status
  role: "unverified" | "verified" | "admin";
  isBanned: boolean;
  banReason?: string;
  
  // Profile Information
  bio?: string;
  contactInfo?: string;
  
  // Timestamps
  lastLogin?: Date;
  lastActive?: Date;
}

const userSchema = new Schema<IUser>(
  {
    // Required fields
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    phoneNumber: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true 
    },
    displayName: { 
      type: String, 
      required: true,
      trim: true 
    },
    profileImage: { 
      type: String, 
      required: true 
    },

    // Authentication & Verification
    isPhoneVerified: { 
      type: Boolean, 
      default: false 
    },
    isEmailVerified: { 
      type: Boolean, 
      default: false 
    },
    phoneVerificationOtp: String,
    phoneVerificationExpiry: Date,
    emailVerificationToken: String,
    emailVerificationExpiry: Date,
    passwordResetOtp: String,
    passwordResetExpiry: Date,
    refreshToken: String,

    // Role & Status
    role: {
      type: String,
      enum: ["unverified", "verified", "admin"],
      default: "unverified"
    },
    isBanned: { 
      type: Boolean, 
      default: false 
    },
    banReason: String,

    // Profile Information
    bio: {
      type: String,
      maxLength: 500
    },
    contactInfo: {
      type: String,
      maxLength: 200
    },

    // Timestamps
    lastLogin: Date,
    lastActive: Date
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.phoneVerificationOtp;
        delete ret.phoneVerificationExpiry;
        delete ret.emailVerificationToken;
        delete ret.emailVerificationExpiry;
        delete ret.passwordResetOtp;
        delete ret.passwordResetExpiry;
        return ret;
      }
    }
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isBanned: 1 });

export default mongoose.model<IUser>("User", userSchema);
