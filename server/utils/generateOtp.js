import {sendEmailOTP} from "./sendEmail.js";
import User from "../model/user.js";
import Tutor from "../model/tutor.js";
import { randomInt } from 'node:crypto';

const generateOtp = async (role, email) => {
  try {
    const db = role === 'user' ? User : Tutor;
    
    const otp = randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    // Find the record and update otp and otpExpires
    const record = await db.findOneAndUpdate(
      { email },
      { otp, otpExpires },
      { new: true } 
    );

    if (!record) {
      throw new Error('User not found');
    }

      const sendMail = await sendEmailOTP(record.email, record.firstName, otp);

    if (!sendMail) {
      await db.findOneAndDelete({ email: record.email });
      throw new Error("Invalid Email or Sending otp failed");
    }

  } catch (error) {
    console.log(error);
    throw error; // Propagate the error to the caller
  }
};

export default generateOtp;

export const generateOtpCode = () => {

  const otp = randomInt(100000, 999999).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000;

  return {otp , otpExpires}
}

export const saveOtp = async (role,email,otp,otpExpires) => {

      const db = role === 'user' ? User : Tutor;

      const record = await db.findOneAndUpdate(
        { email },
        { otp, otpExpires },
        { new: true } 
      );

      if (!record) {
        throw new Error('User not found');
      }

    return true
}