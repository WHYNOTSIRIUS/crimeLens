import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import CrimeReport from "../models/crimeReportModel";
import { AuthRequest } from "../types/AuthRequest";
import User from "../models/userModel"; // ✅ Import User model
import mongoose from "mongoose";
import { analyzeFakeReport } from "../services/fakeReportDetection";

/**
 * @desc Create a new crime report
 * @route POST /api/crime-reports
 * @access Verified Users Only
 */
export const createReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, division, district, crimeTime, video } =
      req.body;

    console.log("✅ Received Data:", req.body); // Debugging log

    // 🔹 Check required fields
    if (!title || !description || !division || !district || !crimeTime) {
      return next(createHttpError(400, "All fields are required"));
    }

    // 🔹 Validate images array
    const images = req.body.images || [];
    if (!Array.isArray(images) || images.length === 0) {
      return next(createHttpError(400, "At least one image is required"));
    }

    // 🔹 Validate video format (optional)
    let videoUrl = null;
    if (video) {
      if (typeof video !== "string" || !video.startsWith("http")) {
        return next(createHttpError(400, "Invalid video URL format"));
      }
      videoUrl = video;
    }

    // 🔹 Create new crime report
    const newReport = new CrimeReport({
      user: req.userId,
      title,
      description,
      division,
      district,
      crimeTime,
      images,
      video: videoUrl, // Store validated video URL
    });

    await newReport.save();

    console.log("✅ Saved Report:", newReport); // Debugging log

    res.status(201).json({
      message: "Crime report submitted successfully",
      report: newReport,
    });
  } catch (error) {
    console.error(
      "❌ Error in createReport:",
      error instanceof Error ? error.message : "Unknown error",
      error instanceof Error ? error.stack : ""
    );
    next(createHttpError(500, "Internal Server Error"));
  }
};

/**
 * @desc Get all crime reports with pagination, filtering & search
 * @route GET /api/crime-reports
 * @access Public
 */
export const getAllReports = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10, division, district, search } = req.query;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (division) filter.division = division;
    if (district) filter.district = district;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const reports = await CrimeReport.find(filter)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    const totalReports = await CrimeReport.countDocuments(filter);

    res.status(200).json({ totalReports, reports });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

/**
 * @desc Get a single crime report by ID
 * @route GET /api/crime-reports/:id
 * @access Public
 */
export const getReportById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const report = await CrimeReport.findById(id).populate(
      "user",
      "email profileImage"
    );

    if (!report) {
      return next(createHttpError(404, "Crime report not found"));
    }

    res.status(200).json(report);
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

/**
 * @desc Delete a crime report (Only Author or Admin)
 * @route DELETE /api/crime-reports/:id
 * @access Verified Users Only
 */
export const deleteReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // ✅ Ensure report ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(400, "Invalid report ID"));
    }

    const report = await CrimeReport.findById(id);
    if (!report) {
      return next(createHttpError(404, "Crime report not found"));
    }

    // ✅ Fetch the user to check their role
    const user = await User.findById(req.userId);
    if (!user) {
      return next(createHttpError(401, "User not found"));
    }

    // ✅ Check if user is either the report author OR an admin
    if (report.user.toString() !== req.userId && user.role !== "admin") {
      return next(
        createHttpError(403, "You are not authorized to delete this report")
      );
    }

    await report.deleteOne();
    res.status(200).json({ message: "Crime report deleted successfully" });
  } catch (error) {
    console.error("❌ deleteReport Error:", error);
    next(createHttpError(500, "Internal Server Error"));
  }
};

export const checkCrimeReportVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    console.log("✅ crimeReportId:", id);

    // ✅ Ensure crimeReportId is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(400, "Invalid crime report ID"));
    }

    const report = await CrimeReport.findById(id);
    if (!report) {
      return next(createHttpError(404, "Crime report not found"));
    }

    res.status(200).json({
      id,
      isVerified: report.isVerified,
      verificationScore: report.verificationScore,
    });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

export const checkFakeReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    console.log("✅ id:", id);
    // verify if id is a valid crime report id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(400, "Invalid crime report ID"));
    }

    const result = await analyzeFakeReport(id);

    res.status(200).json({
      message: "AI analysis completed",
      analysis: result,
    });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};
