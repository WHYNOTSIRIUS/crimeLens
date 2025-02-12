import mongoose, { Schema, Document } from "mongoose";

interface ICrimeReport extends Document {
  title: string;
  description: string;
  division: string;
  district: string;
  images: string[];
  video?: string;
  postTime: Date;
  crimeTime: Date;
  user: mongoose.Types.ObjectId;
  verificationScore: number;
  isVerified: boolean; // ✅ New field to track verification status
}

const crimeReportSchema: Schema<ICrimeReport> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    division: { type: String, required: true },
    district: { type: String, required: true },
    images: { type: [String], required: true },
    video: { type: String },
    postTime: { type: Date, default: Date.now },
    crimeTime: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    verificationScore: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false }, // ✅ New field
  },
  { timestamps: true }
);

export default mongoose.model<ICrimeReport>("CrimeReport", crimeReportSchema);
