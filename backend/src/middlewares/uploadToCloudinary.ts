import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Request, Response, NextFunction } from "express";
import { config } from "../config/config";
import streamifier from "streamifier";

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

// ✅ Multer setup (Using memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage }).array("images", 5); // Max 5 images

/**
 * Middleware to upload images to Cloudinary
 */
export const uploadToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files || !(req.files instanceof Array)) {
      return next();
    }

    const imageFiles = req.files as Express.Multer.File[];

    console.log("✅ Uploading images to Cloudinary...");

    const uploadedImageURLs = await Promise.all(
      imageFiles.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "crime_reports" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result?.secure_url as string);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      })
    );

    req.body.images = uploadedImageURLs;
    console.log("✅ Cloudinary Upload Successful:", uploadedImageURLs);

    next();
  } catch (error) {
    console.error("❌ Cloudinary Upload Failed:", error);
    next(error);
  }
};

export { upload };
