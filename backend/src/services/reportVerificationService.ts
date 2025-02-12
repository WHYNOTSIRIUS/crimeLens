import CrimeReport from "../models/crimeReportModel";
import Comment from "../models/commentModel";

/**
 * Automatically verify a crime report based on upvotes, downvotes, and comments
 */
export const checkAndVerifyCrimeReport = async (reportId: string) => {
  try {
    const report = await CrimeReport.findById(reportId);
    if (!report) return;

    // ✅ Count upvotes and downvotes
    const upvotes = await report.verificationScore;
    const downvotes = (await report.verificationScore) - upvotes;

    // ✅ Count verified comments with proof
    const verifiedComments = await Comment.countDocuments({
      crimeReport: reportId,
      proofImages: { $exists: true, $not: { $size: 0 } },
    });

    // ✅ Calculate Verification Score
    const totalVotes = upvotes + downvotes + verifiedComments;
    if (totalVotes === 0) return;

    const verificationScore =
      (upvotes - downvotes + verifiedComments) / totalVotes;

    // ✅ If score >= 80%, mark as verified
    report.isVerified = verificationScore >= 0.8;
    await report.save();

    console.log(
      `✅ Crime report ${reportId} verification status: ${report.isVerified}`
    );
  } catch (error) {
    console.error("❌ Error verifying crime report:", error);
  }
};
