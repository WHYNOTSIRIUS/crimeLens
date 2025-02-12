import twilio from 'twilio';
import { config } from '../config/config';
import { generateOTP } from '../utils/otpUtils';
import User from '../models/userModel';

const client = twilio(
  config.twilio_account_sid,
  config.twilio_auth_token
);

const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove any non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // If number starts with '0', replace it with Bangladesh country code
  if (digits.startsWith('0')) {
    return '+880' + digits.slice(1);
  }
  
  // If number doesn't have country code, add it
  if (!digits.startsWith('880')) {
    return '+880' + digits;
  }
  
  // If number starts with '880' but no '+', add it
  if (digits.startsWith('880')) {
    return '+' + digits;
  }
  
  return phoneNumber;
};

export const sendOtp = async (to: string): Promise<string> => {
  try {
    const formattedNumber = formatPhoneNumber(to);
    const otp = process.env.NODE_ENV === 'development' ? '123456' : generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in user document
    await User.findOneAndUpdate(
      { phoneNumber: to },
      { 
        phoneVerificationOtp: otp,
        phoneVerificationExpiry: otpExpiry
      }
    );

    if (process.env.NODE_ENV === 'development') {
      console.log('Development Mode - OTP:', otp);
      return otp;
    }

    // Send OTP via Twilio in production
    await client.messages.create({
      body: `Your CrimeLens verification code is: ${otp}. Valid for 10 minutes.`,
      to: formattedNumber,
      from: config.twilio_phone_number
    });

    return otp;
  } catch (error: any) {
    console.error('Failed to send OTP:', error);
    if (error.code === 21608) {
      throw new Error('Phone number needs to be verified in Twilio console first');
    }
    throw new Error('Failed to send verification code');
  }
};

export const verifyOtp = async (phoneNumber: string, code: string): Promise<boolean> => {
  try {
    const user = await User.findOne({
      phoneNumber,
      phoneVerificationOtp: code,
      phoneVerificationExpiry: { $gt: new Date() }
    });

    if (!user) {
      return false;
    }

    // Clear OTP after successful verification
    user.phoneVerificationOtp = undefined;
    user.phoneVerificationExpiry = undefined;
    user.isPhoneVerified = true;
    
    // If both email and phone are verified, promote to verified role
    if (user.isEmailVerified) {
      user.role = "verified";
    }
    
    await user.save();
    return true;
  } catch (error) {
    console.error('Failed to verify OTP:', error);
    throw new Error('Failed to verify code');
  }
}; 
