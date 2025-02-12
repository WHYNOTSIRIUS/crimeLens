import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Request, Response, NextFunction } from "express";
import { config } from "../config/config";
import streamifier from "streamifier";
import createHttpError from "http-errors"; // Import error handling

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

// ✅ Multer setup (Using memory storage)
const storage = multer.memoryStorage();
const uploadSingle = multer({ storage }).single("profileImage");

/**
 * Middleware to upload a single image to Cloudinary
 */
export const uploadSingleToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return next(createHttpError(400, "Profile image is required.")); // ✅ Throw error if no file is uploaded
    }

    console.log("✅ Uploading profile image to Cloudinary...");

    const uploadedURL: string = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "profile_images" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result?.secure_url as string);
        }
      );

      streamifier.createReadStream(req.file!.buffer).pipe(uploadStream);
    });

    req.body.profileImage = uploadedURL; // ✅ Store URL in request body

    console.log("✅ Cloudinary Upload Successful:", {
      profileImage: uploadedURL,
    });

    next();
  } catch (error) {
    console.error("❌ Cloudinary Single Image Upload Failed:", error);
    next(createHttpError(500, "Failed to upload profile image."));
  }
};

export { uploadSingle };
