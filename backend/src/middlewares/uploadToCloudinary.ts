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
const upload = multer({ storage }).fields([
  { name: "images", maxCount: 5 }, // Allow up to 5 images
  { name: "video", maxCount: 1 }, // Allow only 1 video
]);

/**
 * Middleware to upload images and videos to Cloudinary
 */
export const uploadToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files) {
      return next();
    }

    let uploadedImageURLs: string[] = [];
    let uploadedVideoURL: string | null = null;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // ✅ Upload images to Cloudinary
    if (files.images) {
      console.log("✅ Uploading images to Cloudinary...");
      uploadedImageURLs = await Promise.all(
        files.images.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "crime_reports/images" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result?.secure_url as string);
              }
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
          });
        })
      );
    }

    // ✅ Upload video to Cloudinary
    if (files.video) {
      console.log("🎥 Uploading video to Cloudinary...");
      const videoFile = files.video[0];
      uploadedVideoURL = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "video", folder: "crime_reports/videos" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url as string);
          }
        );
        streamifier.createReadStream(videoFile.buffer).pipe(uploadStream);
      });
    }

    req.body.images = uploadedImageURLs;
    req.body.video = uploadedVideoURL;

    console.log("✅ Cloudinary Upload Successful:", {
      images: uploadedImageURLs,
      video: uploadedVideoURL,
    });

    next();
  } catch (error) {
    console.error("❌ Cloudinary Upload Failed:", error);
    next(error);
  }
};

export { upload };
