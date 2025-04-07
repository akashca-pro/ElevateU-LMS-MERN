import Tutor from "../../model/tutor.js";
import Wallet from "../../model/wallet.js";
import ResponseHandler from "../../utils/responseHandler.js";
import HttpStatus from "../../utils/statusCodes.js";
import { STRING_CONSTANTS } from "../../utils/stringConstants.js";

export const addBankAccountDetails = async (req,res) => {
    
    try {
        const tutorId = req.tutor.id;
        const { formData } = req.body;

        if(!formData)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.BAD_REQUEST);

        await Tutor.findByIdAndUpdate(tutorId,{ $set : { bankDetails : formData } });

        return ResponseHandler.success(res, STRING_CONSTANTS.ADDING_BANK_DETAILS_SUCCESS, HttpStatus.OK,formData)

    } catch (error) {
        console.log(STRING_CONSTANTS.SERVER,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
