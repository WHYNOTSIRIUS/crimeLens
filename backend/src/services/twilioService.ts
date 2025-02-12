import twilio from 'twilio';

const client = twilio(
  process.env.TWILLO_ACCOUNT_SID,
  process.env.TWILLO_AUTH_TOKEN
);

export const sendSMS = async (to: string, message: string): Promise<void> => {
  try {
    await client.verify.v2
      .services(process.env.TWILLO_VERIFICATION_SID!)
      .verifications.create({
        to,
        channel: 'sms'
      });
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw new Error('Failed to send verification code');
  }
};

export const verifyOTP = async (to: string, code: string): Promise<boolean> => {
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILLO_VERIFICATION_SID!)
      .verificationChecks.create({
        to,
        code
      });
    
    return verification.status === 'approved';
  } catch (error) {
    console.error('Failed to verify OTP:', error);
    throw new Error('Failed to verify code');
  }
}; 