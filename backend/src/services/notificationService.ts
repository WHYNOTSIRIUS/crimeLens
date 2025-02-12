import admin from "../config/firebase";
import Notification from "../models/notificationModel";
import User from "../models/userModel";
import CrimeReport from "../models/crimeReportModel";
import { Types } from "mongoose";

class NotificationService {
  // Send notification for new comments
  static async handleCommentNotification(
    crimeReportId: Types.ObjectId,
    commenterId: Types.ObjectId
  ) {
    try {
      const crimeReport = await CrimeReport.findById(crimeReportId).populate({
        path: "user",
        select: "fcmTokens notificationPreferences displayName",
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const crimeReportUser = crimeReport?.user as any;
      if (!crimeReport || !crimeReportUser?.notificationPreferences?.comments) {
        return;
      }

      const commenter = await User.findById(commenterId).select("displayName");
      if (!commenter) {
        return;
      }

      // Create notification in MongoDB
      const notification = await Notification.create({
        user: crimeReportUser._id,
        type: "comment",
        crimeReport: crimeReportId,
        message: `${commenter.displayName} commented on your report: "${crimeReport.title}"`,
        isRead: false,
      });

      // Send Firebase notification
      if (crimeReportUser.fcmTokens?.length > 0) {
        const messageData = {
          notification: {
            title: "New Comment on Your Report",
            body: `${commenter.displayName} commented on your report`,
          },
          data: {
            type: "comment",
            crimeReportId: crimeReportId.toString(),
            notificationId: (notification._id as Types.ObjectId).toString(),
          },
          token: crimeReportUser.fcmTokens[0],
        };

        await admin.messaging().send(messageData);
      }
    } catch (error) {
      console.error("Error sending comment notification:", error);
    }
  }

  // Send notification for votes
  static async handleVoteNotification(
    crimeReportId: Types.ObjectId,
    voterId: Types.ObjectId,
    voteType: "upvote" | "downvote"
  ) {
    try {
      const crimeReport = await CrimeReport.findById(crimeReportId).populate({
        path: "user",
        select: "fcmTokens notificationPreferences displayName",
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const crimeReportUser = crimeReport?.user as any;
      if (!crimeReport || !crimeReportUser?.notificationPreferences?.votes) {
        return;
      }

      // Create notification in MongoDB
      const notification = await Notification.create({
        user: crimeReportUser._id,
        type: voteType,
        crimeReport: crimeReportId,
        message: `Someone ${voteType}d your report: "${crimeReport.title}"`,
        isRead: false,
      });

      // Send Firebase notification
      if (crimeReportUser.fcmTokens?.length > 0) {
        const message = {
          notification: {
            title: `New ${
              voteType.charAt(0).toUpperCase() + voteType.slice(1)
            }`,
            body: `Someone ${voteType}d your report`,
          },
          data: {
            type: voteType,
            crimeReportId: crimeReportId.toString(),
            notificationId: (notification._id as Types.ObjectId).toString(),
          },
          token: crimeReportUser.fcmTokens[0],
        };

        await admin.messaging().send(message);
      }
    } catch (error) {
      console.error("Error sending vote notification:", error);
    }
  }

  // Mark notification as read
  static async markAsRead(
    notificationId: Types.ObjectId,
    userId: Types.ObjectId
  ) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );
  }

  // Get user's notifications
  static async getUserNotifications(userId: Types.ObjectId) {
    return Notification.find({ user: userId })
      .populate("crimeReport", "title")
      .sort({ createdAt: -1 })
      .limit(50);
  }
}

export default NotificationService;
