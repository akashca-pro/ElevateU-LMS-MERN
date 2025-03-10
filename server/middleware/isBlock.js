import User from "../model/user.js"
import Tutor from "../model/tutor.js"
import ResponseHandler from "../utils/responseHandler.js"
import { STRING_CONSTANTS } from "../utils/stringConstants.js"
import HttpStatus from "../utils/statusCodes.js"

const roleModals = {
    user : 'User',
    tutor : 'Tutor'
}

export const isBlock = (role) => async (req,res,next) => {
    
    try {
        const Model = roleModals[role]
        const id = req[Model].id
        const isBlock = Model.findOne({_id : id , isBlock : true})
        if(isBlock)
            return ResponseHandler.error(res, STRING_CONSTANTS.BLOCKED, HttpStatus.FORBIDDEN);

        next()

    } catch (error) {
        console.log(STRING_CONSTANTS.SERVER, error)
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}