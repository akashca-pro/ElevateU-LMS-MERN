import User from "../model/user.js";
import Tutor from "../model/tutor.js";
import generateOtp from "../utils/generateOtp.js";

export const retryVerifyUser = async (req, res, next) => {
    try {
      const {email} = req.body;
      const user = await User.findOne({ email });
      
      if (!user || user.isVerified) {
        return next(); // Pass control to the next middleware or route handler
      }
  
      generateOtp(email);
      // Call verifyOtp as a promise
      res.status(201).json({message : "otp sent to email"});
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

  export const retryVerifyTutor = async (req, res, next) => {
    try {
      const {email} = req.body;
      const tutor = await Tutor.findOne({ email });
      
      if (!tutor || tutor.isVerified) {
         return next(); // Pass control to the next middleware or route handler
      }
  
      generateOtp('tutor',email);
      // Call verifyOtp as a promise
      res.status(201).json({message : "otp sent to email"});
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
