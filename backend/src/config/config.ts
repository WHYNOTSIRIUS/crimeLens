import { config as dotenv } from "dotenv";
import { env } from "process";

dotenv(); // loading the environment variables

const _cofig = {
  port: env.PORT || 3000,
  dburl: env.MONGO_URI,
  env: env.NODE_ENV,
  jwtSecret: env.JWT_SECRET,
  email: env.EMAIL,
  password: env.PASSWORD,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  gemini_api_key: process.env.GEMINI_API_KEY,
  // twilio
  twilio_account_sid: process.env.TWILLO_ACCOUNT_SID,
  twilio_auth_token: process.env.TWILLO_AUTH_TOKEN,
  twillo_verify_sid: process.env.TWILLO_VERIFICATION_SID,
};

// freezing

export const config = Object.freeze(_cofig);
