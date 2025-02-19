import nodemailer from 'nodemailer'
import 'dotenv/config'

const sendEmail = async(email,name,otp)=>{
    const transport = nodemailer.createTransport({
        service : 'gmail',
        auth :{
            user : process.env.SENDER_EMAIL,
            pass : process.env.SENDER_PASS
        },
    });

    await transport.sendMail({
        from : process.env.SENDER_EMAIL,
        to : email,
        subject : `ElevateU Verification Message`,
        text : `
      Dear ${name},

      Welcome to ElevateU!

      To ensure the security of your account, we require you to verify your email address. Please use the One-Time Password (OTP) provided below to complete your email verification:

      Your OTP Code: ${otp}

      This code is valid for the next 10 minutes.

      If you did not request this OTP, please ignore this email or contact our support team for assistance.

      Thank you for choosing ElevateU. We're excited to have you on board and look forward to helping you achieve your learning goals.

      Best regards,
      The ElevateU Team
      www.ElevateU.edu
      elevateulms@gmail.com
      `,
    });
    return true
};

export default sendEmail