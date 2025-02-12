import { config as dotenv } from "dotenv";
import { env } from "process";

dotenv(); // loading the environment variables

const _cofig = {
  port: env.PORT || 3000,
  dburl: env.MONGODB_URI,
  env: env.NODE_ENV,
  jwtSecret: env.JWT_SECRET,
  email_user: env.EMAIL_USER,
  email_password: env.EMAIL_PASSWORD,
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  gemini_api_key: env.GEMINI_API_KEY,
  // twilio
  twilio_account_sid: env.TWILLO_ACCOUNT_SID,
  twilio_auth_token: env.TWILLO_AUTH_TOKEN,
  twillo_verify_sid: env.TWILLO_VERIFICATION_SID,
  frontend_url: env.FRONTEND_URL,
};

// freezing

export const config = Object.freeze(_cofig);
