import admin from "../config/firebase";

/**
 * Store a notification in Firestore
 */
export const createNotification = async (
  userId: string,
  type: "comment" | "upvote" | "downvote" | "admin",
  message: string,
  crimeReportId?: string,
  commentId?: string
) => {
  try {
    const firestore = admin.firestore();
    await firestore.collection("notifications").add({
      userId,
      type,
      message,
      crimeReportId: crimeReportId || null,
      commentId: commentId || null,
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✅ Notification stored in Firestore for user: ${userId}`);
  } catch (error) {
    console.error("❌ Error storing notification:", error);
  }
};
