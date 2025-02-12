import express from "express";
import authenticateUser from "../middleware/authenticate";
import {
  createReport,
  deleteReport,
  getAllReports,
  getReportById,
} from "../controller/crimeReportController";
import { upload } from "../middleware/uploadMiddleware";
import isVerifiedUser from '../middleware/isVerifiedUser';

const crimeReportRouter = express.Router();

// 📌 Create a crime report (Only verified users)
crimeReportRouter.post(
  "/",
  authenticateUser,
  isVerifiedUser,
  upload.single('image'),
  createReport
); // ✅

// 📌 Get all crime reports (Paginated, Filterable, Searchable)
crimeReportRouter.get("/", getAllReports); // ✅

// 📌 Get a single crime report by ID
crimeReportRouter.get("/:id", getReportById); // ✅

// 📌 Delete crime report (Only the author or admin)
crimeReportRouter.delete(
  "/:id",
  authenticateUser,
  isVerifiedUser,
  deleteReport
); // ✅

export default crimeReportRouter;
