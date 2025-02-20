import User from "../model/user.js";
import Tutor from "../model/tutor.js";
import { randomInt } from 'node:crypto';

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