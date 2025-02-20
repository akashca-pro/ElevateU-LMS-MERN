import User from "../model/user.js";
import Tutor from "../model/tutor.js";
import { generateOtpCode, saveOtp } from "../utils/generateOtp.js";
import { sendEmailOTP } from "../utils/sendEmail.js";

const retryVerify = (role) => {

  return async (req, res, next) => {

    try {
      const db = role==='user' ? User : Tutor ;

      const {email} = req.body;
      const data = await db.findOne({ email });
      
      if (!data || data.isVerified) return next(); // Pass control to the next middleware or route handler

      const {otp,otpExpires} = generateOtpCode();

      await saveOtp(role,email,otp,otpExpires);

      await sendEmailOTP(email,data.firstName,otp);
      
      return res.status(201).json({message : "otp sent to email"});
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}
  
export default retryVerify