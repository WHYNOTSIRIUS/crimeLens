import express from "express";
import authenticateUser from "../middleware/authenticate";
import isVerifiedUser from "../middleware/isVerifiedUser";
import { authorizeRole } from "../middleware/authorizeRole";
import {
  addComment,
  getComments,
  deleteComment,
} from "../controller/commentController";

const commentRouter = express.Router();

// 📌 Add a comment with proof (Only verified users)
commentRouter.post(
  "/:crimeReportId",
  authenticateUser,
  isVerifiedUser,
  addComment
); // ✅

// 📌 Get all comments for a crime report (Public)
commentRouter.get("/:crimeReportId", getComments);

// 📌 Admin deletes a comment
commentRouter.delete("/:commentId", authenticateUser, authorizeRole(["admin", "superadmin"]), deleteComment);

export default commentRouter;
