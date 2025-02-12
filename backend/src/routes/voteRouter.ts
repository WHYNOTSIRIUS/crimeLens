import express from "express";
import authenticateUser from "../middleware/authenticate";
import isVerifiedUser from "../middleware/isVerifiedUser";
import {
  castVote,
  removeVote,
  getVotesByReport,
  getVotesByUser,
  getVotesByUserAndReport,
  deleteVote,
} from "../controller/voteController";  

const voteRouter = express.Router();

// Create a vote
voteRouter.post(
  "/:reportId",
  authenticateUser,
  isVerifiedUser,
  castVote
);

// Update a vote
voteRouter.put(
  "/:voteId",
  authenticateUser,
  isVerifiedUser,
  removeVote
);

// Delete a vote
voteRouter.delete(
  "/:voteId",
  authenticateUser,
  isVerifiedUser,
  deleteVote
);

// Get votes for a report
voteRouter.get("/report/:reportId", getVotesByReport);

// Get votes for a user
voteRouter.get("/user/:userId", getVotesByUser);

// Get votes for a user and report
voteRouter.get("/user/:userId/report/:reportId", getVotesByUserAndReport);

export default voteRouter;
