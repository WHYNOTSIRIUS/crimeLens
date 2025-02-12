/* eslint-disable prefer-const */
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import Vote from "../models/voteModel";
import CrimeReport from "../models/crimeReportModel";
import { AuthRequest } from "../types/AuthRequest";

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
    const { crimeReportId } = req.body;

    if (!crimeReportId) {
      return next(createHttpError(400, "Crime report ID is required"));
    }

    // Ensure the crime report exists
    const crimeReport = await CrimeReport.findById(crimeReportId);
    if (!crimeReport) {
      return next(createHttpError(404, "Crime report not found"));
    }

    // Check if the user has already voted
    const existingVote = await Vote.findOne({
      user: req.userId,
      crimeReport: crimeReportId,
    });

    if (!existingVote) {
      // If no vote exists, default to upvote
      const newVote = new Vote({
        user: req.userId,
        crimeReport: crimeReportId,
        vote: "upvote",
      });
      await newVote.save();
    } else if (existingVote.vote === "upvote") {
      // If the user already upvoted, remove the vote
      await existingVote.deleteOne();
    } else {
      // If the user had downvoted, switch to upvote
      existingVote.vote = "upvote";
      await existingVote.save();
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

    crimeReport.verificationScore = Math.max(0, upvotes - downvotes);
    await crimeReport.save();

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


export const getVotesByReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = req.params;

    const votes = await Vote.find({ crimeReport: reportId });

    res.status(200).json({
      votes,
    });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};


export const getVotesByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const votes = await Vote.find({ user: userId });

    res.status(200).json({
      votes,
    });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

export const getVotesByUserAndReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, reportId } = req.params;

    const votes = await Vote.find({ user: userId, crimeReport: reportId });

    res.status(200).json({
      votes,
    });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

export const updateVote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { voteId } = req.params;

    const { vote } = req.body;

    const updatedVote = await Vote.findByIdAndUpdate(voteId, { vote }, { new: true });

    res.status(200).json({
      message: "Vote updated successfully",
      updatedVote,
    });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};


export const deleteVote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { voteId } = req.params;

    await Vote.findByIdAndDelete(voteId);

    res.status(200).json({
      message: "Vote deleted successfully",
    });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error"));
  }
};

