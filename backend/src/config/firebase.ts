import admin from "firebase-admin";
import { config } from "dotenv";
import path from "path";

config(); // Load environment variables

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require(path.resolve(
  __dirname,
  "..",
  process.env.FIREBASE_ADMIN_SDK_PATH as string
));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
