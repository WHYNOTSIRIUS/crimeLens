declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: 'development' | 'production';
      MONGODB_URI: string;
      JWT_SECRET: string;
      FRONTEND_URL: string;
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      EMAIL_USER: string;
      EMAIL_PASSWORD: string;
      TWILLO_ACCOUNT_SID: string;
      TWILLO_AUTH_TOKEN: string;
      TWILLO_VERIFICATION_SID: string;
      GEMINI_API_KEY: string;
      FIREBASE_ADMIN_SDK_PATH: string;
    }
  }
}

export {}; 