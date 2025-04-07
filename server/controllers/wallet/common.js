import Wallet from "../../model/wallet.js";
import ResponseHandler from "../../utils/responseHandler.js";
import HttpStatus from "../../utils/statusCodes.js";
import { STRING_CONSTANTS } from "../../utils/stringConstants.js";

// load wallets of tutor and admin

export const loadWalletDetails = (role) => async (req,res) => {
    
    try {
        const userId = req[role.toLowerCase()].id
        const limit = parseInt(req.query.limit) || 20;
        const wallet = await Wallet.findOne({ userId , userModel : role })

        if(!wallet)
            return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_WALLET_ERROR, HttpStatus.NO_CONTENT)

        const walletDetails = {
            balance : wallet.balance,
            walletId : wallet._id,
            totalEarnings : wallet?.totalEarnings || 0,
            totalWithdrawals : wallet?.totalWithdrawals || 0,
            lastUpdated : wallet.updatedAt.toISOString(),
            currency : 'INR',
            status : wallet.isActive,
            paymentMethods: [
                { id: "pm1", type: "paypal", email: "user@example.com", isDefault: true },
                { id: "pm2", type: "bank", accountNumber: "****6789", isDefault: false },
              ],
        }

        const transactions = wallet.transactions
        .slice(0,limit)
        .map((transaction,index)=>{
       
            return {
                id : index + 1,
                date : transaction.updatedAt.toISOString(),
                amount : transaction.amount,
                type : transaction.type,
                purpose : transaction.purpose,
                platformFee : transaction.purpose === 'course_purchase' ? transaction.platformFee : undefined,
                status : transaction.status,
                description : transaction.description,
                reference : transaction._id
            }
        });


        return ResponseHandler.success(res, STRING_CONSTANTS.LOADING_WALLET_SUCCESS, HttpStatus.OK,{
            walletDetails, 
            transactions : (transactions && transactions.length > 0 ) ? transactions : []
        })
        

    } catch (error) {
        console.log(STRING_CONSTANTS.SERVER,error);
        return ResponseHandler.error(res, STRING_CONSTANTS.SERVER, HttpStatus.INTERNAL_SERVER_ERROR)
    }

}