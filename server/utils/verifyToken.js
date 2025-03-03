import 'dotenv/config'
import jwt from "jsonwebtoken";

const TOKEN_NAMES = {
    user: process.env.USER_ACCESS_TOKEN_NAME,
    tutor: process.env.TUTOR_ACCESS_TOKEN_NAME,
    admin: process.env.ADMIN_ACCESS_TOKEN_NAME
};

const REFRESH_TOKEN = {
    user : process.env.USER_REFRESH_TOKEN_NAME,
    tutor : process.env.TUTOR_REFRESH_TOKEN_NAME,
    admin : process.env.ADMIN_REFRESH_TOKEN_NAME
}

export const verifyAccessToken = (role) => (req, res, next) => {
    const tokenName = TOKEN_NAMES[role];

    if (!tokenName) {
        return res.status(400).json({ message: "Invalid role specified" });
    }

    const token = req.cookies[tokenName];
    if (!token) {
        return res.status(401).json({ message: "Access Token Required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req[role] = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid Token" });
    }
};

export const verifyRefreshToken = (role) => (req,res,next)=>{
    const tokenName = REFRESH_TOKEN[role]
    
    if (!tokenName) {
        return res.status(400).json({ message: "Invalid role specified" });
    }

    const token = req.cookies[tokenName];
    if (!token) {
        return res.status(401).json({ message: "Refresh Token Required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH);
        req[role] = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid Token" });
    }
}
