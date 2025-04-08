import Transaction from "../../model/transaction.js";
import Wallet from "../../model/wallet.js";
import ResponseHandler from "../../utils/responseHandler.js";
import HttpStatus from "../../utils/statusCodes.js";
import { STRING_CONSTANTS } from "../../utils/stringConstants.js";

const handleWithdrawalTransaction = async ({ adminId, amount }) => {
    
    try {
        const transaction = await Transaction.create({
            type : 'admin_withdrawal',
            source : {
                adminId
            },
            amount : {
                adminPayout : amount
            }
        })

        // create admin transaction data
        const withdrawTransaction = {
            transactionId : transaction._id,
            type: 'debit',
            amount,
            purpose: 'withdrawal',
            status: 'completed',
            description: `You withdrawed ${amount} `  
        }

        await Wallet.updateOne(
            { userId : adminId, userModel : 'Admin' },
            {
                $push : { transactions : withdrawTransaction },
                $inc : { balance : -amount , totalWithdrawals : amount}
            }
        )

    } catch (error) {
        throw error
    }

}

export const withdrawAmount = async (req,res) => {
    
    try {
        const adminId = req.admin.id;
        const { formData } = req.body;

        if(!formData)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND,HttpStatus.BAD_REQUEST)
        
        const wallet = await Wallet.findOne({ userId : adminId, userModel : 'Admin' });

        if(!wallet)
            return ResponseHandler.error(res, STRING_CONSTANTS.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);

        if(wallet.balance < formData.amount)
            return ResponseHandler.error(res, STRING_CONSTANTS.INSUFFICIENT_FUNDS, HttpStatus.BAD_REQUEST);

        await handleWithdrawalTransaction({ adminId, amount : formData.amount })

        return ResponseHandler.success(res, STRING_CONSTANTS.WITHDRAW_SUCCESS,HttpStatus.OK)

    } catch (error) {
        console.log(STRING_CONSTANTS.SERVER,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}