import axios from "axios";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import CrimeReport from "../models/crimeReportModel";
import createHttpError from "http-errors";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey as string);
const fileManager = new GoogleAIFileManager(apiKey as string);

/**
 * Download an image from Cloudinary and save it as a temporary file
 */
const tempDir = path.join(__dirname, "../../temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log("✅ Created temp directory:", tempDir);
}

/**
 * Download an image from Cloudinary and save it as a temporary file
 */
async function downloadImage(
  imageUrl: string,
  filename: string
): Promise<string> {
  try {
    console.log(`🔍 Downloading image from Cloudinary: ${imageUrl}`);

    const response = await axios({
      url: imageUrl,
      responseType: "arraybuffer",
    });

    const filePath = path.join(tempDir, filename);
    fs.writeFileSync(filePath, response.data);

    console.log(`✅ Image saved at: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error("❌ Error downloading image from Cloudinary:", error);
    throw new Error("Failed to download image");
  }
}
/**
 * Upload an image to Gemini
 */
async function uploadToGemini(imagePath: string) {
  const uploadResult = await fileManager.uploadFile(imagePath, {
    mimeType: "image/jpeg",
    displayName: imagePath,
  });

  console.log(`✅ Uploaded file to Gemini: ${uploadResult.file.displayName}`);
  return uploadResult.file;
}

/**
 * Analyze Crime Report for Fake Report Detection
 */
export const analyzeFakeReport = async (crimeReportId: string) => {
  try {
    // ✅ Fetch report from DB
    const report = await CrimeReport.findById(crimeReportId);
    if (!report) throw createHttpError(404, "Crime report not found");

    // ✅ Download Cloudinary image to local temp folder
    const imagePaths = await Promise.all(
      report.images.map((url, index) =>
        downloadImage(url, `crime_${index}.jpg`)
      )
    );

    // ✅ Upload images to Gemini
    const geminiFiles = await Promise.all(imagePaths.map(uploadToGemini));

    // ✅ Prepare AI Request
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `### AI-Powered Fake Report Detection
You are analyzing a crime report for possible fake or misleading information. Use text and image recognition to assign a confidence score.
If confidence is below 0.3, it's likely real.
If confidence is between 0.3-0.6, needs admin review.
If confidence is above 0.6, flag it as potentially fake.`,
    });

    const chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            { text: `Crime Report Description: ${report.description}` },
            ...geminiFiles.map((file) => ({
              fileData: { mimeType: file.mimeType, fileUri: file.uri },
            })),
          ],
        },
      ],
    });

    // ✅ Get AI Response
    const result = await chatSession.sendMessage("Analyze this report.");
    const aiResponse = result.response.text();

    // console.log("✅ AI Response:", aiResponse);

    return aiResponse;
  } catch (error) {
    console.error("❌ Error analyzing fake report:", error);
    throw new Error("AI analysis failed");
  }
};
