import 'dotenv/config'
import jwt from "jsonwebtoken";
import HttpStatus from './statusCodes.js';
import User from '../model/user.js';
import Admin from '../model/admin.js';
import Tutor from '../model/tutor.js';
import ResponseHandler from './responseHandler.js';
import { STRING_CONSTANTS } from './stringConstants.js';

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

const roleModals = {
    user : User,
    tutor : Tutor,
    admin : Admin
}

export const verifyAccessToken = (role) => async(req, res, next) => {
    const tokenName = TOKEN_NAMES[role];

    if (!tokenName) {
        return ResponseHandler.error(res, STRING_CONSTANTS.TOKEN_ISSUE_ERROR,HttpStatus.NOT_FOUND);  
    }

    const token = req.cookies[tokenName];
    if (!token) {
        return ResponseHandler.error(res, STRING_CONSTANTS.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req[role] = decoded;

        const db = roleModals[role]

        const data = await db.findById(decoded.id)
        
        if(data.isBlocked)
            return ResponseHandler.error(res,STRING_CONSTANTS.NOT_ALLOWED, HttpStatus.FORBIDDEN)

        next();
    } catch (error) {
        console.log(STRING_CONSTANTS.TOKEN_VERIFY_ERROR,HttpStatus.INTERNAL_SERVER_ERROR)
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR)
    }
};

export const verifyRefreshToken = (role) => async(req,res,next)=>{
    const tokenName = REFRESH_TOKEN[role]
    
    if (!tokenName) {
        return ResponseHandler.error(res, STRING_CONSTANTS.TOKEN_ISSUE_ERROR,HttpStatus.NOT_FOUND);  
    }

    const token = req.cookies[tokenName];
    if (!token) {
        return ResponseHandler.error(res, STRING_CONSTANTS.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH);
        req[role] = decoded;

        const db = roleModels[role]

        const isBlocked = await db.findById(decoded,{ isBlocked : true })
        
        if(isBlocked)
            return ResponseHandler.error(res,STRING_CONSTANTS.NOT_ALLOWED, HttpStatus.FORBIDDEN)

        next();
    } catch (error) {
        console.log(STRING_CONSTANTS.TOKEN_VERIFY_ERROR,HttpStatus.INTERNAL_SERVER_ERROR)
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}
