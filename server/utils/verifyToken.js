import 'dotenv/config'
import jwt from 'jsonwebtoken'

// For users

export const verifyUserAccessToken = (req,res,next)=>{
    const {userAccessToken} = req.cookies;
    if(!userAccessToken) return res.status(401).json({ message: "Access Token Required" });

    jwt.verify(userAccessToken, process.env.JWT_SECRET, (error,decoded)=>{
        if(error)return res.status(401).json({message : "Invalid Token"})
        req.user = decoded;
        next()
    })
}

export const verifyUserRefreshToken = (req,res,next)=>{
    const {userRefreshToken} = req.cookies;
    if (!userRefreshToken) return res.status(401).json({ message: "Refresh Token Required" });

    jwt.verify(userRefreshToken, process.env.JWT_REFRESH, (error,decoded)=>{
        if(error) return res.status(401).json({message : "Invalid Refresh Token"})
        req.user = decoded;
        next();
    })
}

// For tutors

export const verifyTutorAccessToken = (req,res,next)=>{
    const {tutorAccessToken} = req.cookies;
    if(!tutorAccessToken) return res.status(401).json({ message: "Access Token Required" });

    jwt.verify(tutorAccessToken, process.env.JWT_SECRET, (error,decoded)=>{
        if(error) return res.status(401).json({message : "Invalid Token"})
        req.tutor = decoded;
        next()
    })
}

export const verifyTutorRefreshToken = (req,res,next)=>{
    const {tutorRefreshToken} = req.cookies;
    if (!tutorRefreshToken) return res.status(401).json({ message: "Refresh Token Required" });

    jwt.verify(tutorRefreshToken, process.env.JWT_REFRESH, (error,decoded)=>{
        if(error)return res.status(401).json({message : "Invalid Refresh Token"})
        req.tutor = decoded;
        next();
    })
}

//For Admin

export const verifyAdminAccessToken = (req,res,next)=>{
    const {adminAccessToken} = req.cookies;
    if(!adminAccessToken) return res.status(401).json({ message: "Access Token Required" });

    jwt.verify(adminAccessToken, process.env.JWT_SECRET, (error,decoded)=>{
        if(error)return res.status(401).json({message : "Invalid Token"})
        req.admin = decoded;
        next()
    })
}

export const verifyAdminRefreshToken = (req,res,next)=>{
    const {adminRefreshToken} = req.cookies;
    if (!adminRefreshToken) return res.status(401).json({ message: "Refresh Token Required" });

    jwt.verify(adminRefreshToken, process.env.JWT_REFRESH, (error,decoded)=>{
        if(error)return res.status(401).json({message : "Invalid Refresh Token"})
        req.admin = decoded;
        next();
    })
}
