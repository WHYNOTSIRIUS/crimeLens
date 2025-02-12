/* eslint-disable prefer-const */
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import Vote from "../models/voteModel";
import CrimeReport from "../models/crimeReportModel";
import { AuthRequest } from "../types/AuthRequest";
import { checkAndVerifyCrimeReport } from "../services/reportVerificationService";

/**
 * @desc Upvote or Downvote a Crime Report
 * @route POST /api/votes
 * @access Verified Users Only
 */
export const castVote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { crimeReportId, voteType } = req.body; // voteType: "upvote" or "downvote"

    if (!crimeReportId || !voteType) {
      return next(
        createHttpError(400, "Crime report ID and vote type are required")
      );
    }

    if (!["upvote", "downvote"].includes(voteType)) {
      return next(
        createHttpError(
          400,
          "Invalid vote type. Must be 'upvote' or 'downvote'"
        )
      );
    }

    // ✅ Ensure the crime report exists
    const crimeReport = await CrimeReport.findById(crimeReportId);
    if (!crimeReport) {
      return next(createHttpError(404, "Crime report not found"));
    }

    // ✅ Check if the user has already voted
    let existingVote = await Vote.findOne({
      user: req.userId,
      crimeReport: crimeReportId,
    });

    if (!existingVote) {
      // ✅ If no vote exists, create a new one
      existingVote = new Vote({
        user: req.userId,
        crimeReport: crimeReportId,
        vote: voteType,
      });
      await existingVote.save();
    } else if (existingVote.vote === voteType) {
      // ✅ If the user votes the same way again, remove the vote
      await existingVote.deleteOne();
    } else {
      // ✅ If the user had an opposite vote, switch to the new vote type
      existingVote.vote = voteType;
      await existingVote.save();
    }

    // ✅ Recalculate Upvotes & Downvotes
    const upvotes = await Vote.countDocuments({
      crimeReport: crimeReportId,
      vote: "upvote",
    });
    const downvotes = await Vote.countDocuments({
      crimeReport: crimeReportId,
      vote: "downvote",
    });

    // ✅ Update verification score
    crimeReport.verificationScore = Math.max(0, upvotes - downvotes);
    await crimeReport.save();

    // ✅ Check if the report should be verified
    await checkAndVerifyCrimeReport(crimeReportId);

    res.status(200).json({
      message: "Vote updated successfully",
      totalUpvotes: upvotes,
      totalDownvotes: downvotes,
      verificationScore: crimeReport.verificationScore,
    });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

/**
 * @desc Get Total Votes for a Crime Report
 * @route GET /api/votes/:crimeReportId
 * @access Public
 */
export const getVotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { crimeReportId } = req.params;

    const upvotes = await Vote.countDocuments({
      crimeReport: crimeReportId,
      vote: "upvote",
    });
    const downvotes = await Vote.countDocuments({
      crimeReport: crimeReportId,
      vote: "downvote",
    });

    res.status(200).json({
      totalUpvotes: upvotes,
      totalDownvotes: downvotes,
      verificationScore: upvotes - downvotes,
    });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

/**
 * @desc Remove User Vote from a Crime Report
 * @route DELETE /api/votes/:crimeReportId
 * @access Verified Users Only
 */
export const removeVote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { crimeReportId } = req.params;

    const deletedVote = await Vote.findOneAndDelete({
      user: req.userId,
      crimeReport: crimeReportId,
    });

    if (!deletedVote) {
      return next(createHttpError(404, "Vote not found"));
    }

    // Update verificationScore
    const upvotes = await Vote.countDocuments({
      crimeReport: crimeReportId,
      vote: "upvote",
    });
    const downvotes = await Vote.countDocuments({
      crimeReport: crimeReportId,
      vote: "downvote",
    });

    await CrimeReport.findByIdAndUpdate(crimeReportId, {
      verificationScore: upvotes - downvotes,
    });

    res.status(200).json({
      message: "Vote removed successfully",
      totalUpvotes: upvotes,
      totalDownvotes: downvotes,
      verificationScore: upvotes - downvotes,
    });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};
