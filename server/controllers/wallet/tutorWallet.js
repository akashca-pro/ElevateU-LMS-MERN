import Tutor from "../../model/tutor.js";
import ResponseHandler from "../../utils/responseHandler.js";
import HttpStatus from "../../utils/statusCodes.js";
import { STRING_CONSTANTS } from "../../utils/stringConstants.js";


export const loadExistingBankDetails = async (req,res) => {
    
    try {
        const tutorId = req.tutor.id;
        const tutor = await Tutor.findById(tutorId)

        if(!tutor)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        if(!tutor?.bankDetails){
            return ResponseHandler.success(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NO_CONTENT);
        }

        const bankDetails = {
            accountNumber : tutor.bankDetails.accountNumber,
            ifsc : tutor.bankDetails.ifsc,
            bankName : tutor.bankDetails.bankName,
            holderName : tutor.bankDetails.holderName
        }

        return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_BANK_DETAILS_SUCCESS, HttpStatus.OK, bankDetails)

    } catch (error) {
        console.log(STRING_CONSTANTS.SERVER,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

export const addBankAccountDetails = async (req,res) => {
    
    try {
        const tutorId = req.tutor.id;
        const { formData } = req.body;

        if(!formData)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.BAD_REQUEST);

        const bankDetails = {
            accountNumber : formData.accountNumber,
            ifsc : formData.ifsc,
            bankName : formData.bankName,
            holderName : formData.holderName
        }
        await Tutor.findByIdAndUpdate(
            tutorId,
            { bankDetails },
            { new: true, upsert: false } 
          )

        return ResponseHandler.success(res, STRING_CONSTANTS.ADDING_BANK_DETAILS_SUCCESS, HttpStatus.OK,formData)

    } catch (error) {
        console.log(STRING_CONSTANTS.SERVER,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

