import jwt from 'jsonwebtoken'
import User from '../model/user.js'
import 'dotenv/config'

const verifyToken = async(req,res,next)=>{
    let token = req.cookies.token;
    if(!token) res.status(401).json({message : 'UnAuthorized , access denied'});

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();

    } catch (error) {
        res.status(401).json({message : 'Invalid Token'});
    }

}

export default verifyToken