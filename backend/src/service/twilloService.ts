import twilio from "twilio";
import { config } from "../config/config";

const client = twilio(config.twilio_account_sid, config.twilio_auth_token);

/**
 * Send an OTP to the user's phone number using Twilio Verify API.
 */
export const sendOtp = async (phoneNumber: string): Promise<string> => {
  try {
    // adding +88 to the phone number
    phoneNumber = "+88" + phoneNumber;
    const verification = await client.verify.v2
      .services(config.twillo_verify_sid as string)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    console.log(
      `✅ OTP sent to ${phoneNumber}. Status: ${verification.status}`
    );
    return verification.status;
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    throw new Error("Failed to send OTP. Please try again.");
  }
};

/**
 * Verify the OTP entered by the user.
 */
export const verifyOtp = async (
  phoneNumber: string,
  otpCode: string
): Promise<boolean> => {
  try {
    const verificationCheck = await client.verify.v2
      .services(config.twillo_verify_sid as string)
      .verificationChecks.create({ to: phoneNumber, code: otpCode });

    console.log(`✅ OTP verification status: ${verificationCheck.status}`);
    return verificationCheck.status === "approved";
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    return false;
  }
};
