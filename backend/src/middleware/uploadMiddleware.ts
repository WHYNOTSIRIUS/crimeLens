import multer from "multer";
import cloudinary from '../config/cloudinary';
import { CloudinaryFile } from "../types/cloudinary";

// Use memory storage instead of disk
const storage = multer.memoryStorage();

// File filter to check file type
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter
});

// Helper function to upload to Cloudinary
export const uploadToCloudinary = async (file: Express.Multer.File): Promise<CloudinaryFile> => {
  try {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'crimeLens',
      transformation: [
        { width: 500, height: 500, crop: 'limit' }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
}; 