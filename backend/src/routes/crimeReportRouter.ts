import { isVerifiedUser } from "./../middlewares/isVerfiedUser";
import express from "express";
import authenticateUser from "../middlewares/authenticate";
import {
  checkCrimeReportVerification,
  checkFakeReport,
  createReport,
  deleteReport,
  getAllReports,
  getReportById,
} from "../controller/crimeReportController";
import { upload, uploadToCloudinary } from "../middlewares/uploadToCloudinary";
const crimeReportRouter = express.Router();

// 📌 Create a crime report (Only verified users)
crimeReportRouter.post(
  "/",
  authenticateUser,
  isVerifiedUser,
  upload,
  uploadToCloudinary,
  createReport
); // ✅

// 📌 Get all crime reports (Paginated, Filterable, Searchable)
crimeReportRouter.get("/", getAllReports); // ✅

// 📌 Get a single crime report by ID
crimeReportRouter.get("/:id", getReportById); // ✅

crimeReportRouter.get("/:id/analyze", checkFakeReport);

crimeReportRouter.get("/:id/verification", checkCrimeReportVerification);

// 📌 Delete crime report (Only the author or admin)
crimeReportRouter.delete(
  "/:id",
  authenticateUser,
  isVerifiedUser,
  deleteReport
); // ✅

export default crimeReportRouter;
