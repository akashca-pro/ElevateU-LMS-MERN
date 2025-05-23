export const STRING_CONSTANTS = Object.freeze({
    REGISTRATION_SUCCESS : 'Registration success',
    REGISTRATION_ERROR : 'Registration error',
    LOGIN_SUCCESS : 'Login success',
    LOGIN_ERROR : 'Login error',
    EXIST : 'already exist',
    INVALID_CREDENTIALS : 'Invalid credentials',
    INVALID_PASSWORD : 'Incorrect password',
    INVALID_INPUT : 'Invalid input',
    LOGOUT_SUCCESS : 'Logout successfully',
    LOGOUT_ERROR : 'Logout failed',
    TOKEN_ISSUED : 'Token issued',
    TOKEN_EXPIRED : 'Token Expired',
    TOKEN_ISSUE_SUCCES : 'Token issued successfully',
    TOKEN_ISSUE_ERROR : 'Token issuing failed',
    TOKEN_VERIFY_ERROR : 'Token verification error',
    DATA_NOT_FOUND : 'Data not found' ,
    USER_NOT_FOUND : 'User not found',
    LOADING_SUCCESS : 'Loading data successfull',
    LOADING_ERROR : 'Loading data failed',
    UPDATION_SUCCESS : 'Updated data successfully',
    UPDATION_ERROR :'Updating data failed',
    CREATION_SUCCESS :'Created succesfully',
    CREATION_ERROR : 'Error saving data',
    DELETION_SUCCESS : 'Deleted successfully',
    DELETION_ERROR : 'Deletion failed',
    OTP_SENT : 'OTP sent to mail',
    OTP_SENT_ERROR : 'OTP sent failed',
    OTP_ERROR :'Invalid or expired OTP',
    RESET_OTP :'Password reset otp sent to your email',
    VERIFICATION_SUCCESS :'Verified successfully',
    VERIFICATION_ERROR : 'Verification failed',
    PASSWORD_RESET_SUCCESS : 'Password reset successfull',
    PASSWORD_RESET_ERROR : 'Password reset failed',
    GOOGLE_AUTH_SUCCESS : 'Google authentication successfull',
    GOOGLE_AUTH_ERROR : 'Google authentication failed',
    UNAUTHORIZED : 'Token not found',
    STATUS_PENDING : 'Verification status pending',
    BLOCKED : 'User blocked',
    UNBLOCKED :'User unblocked',
    SUCCESS : 'Success',
    SERVER : 'Server error',
    DRAFT_LIMIT : 'Draft limit exceeded',
    NOT_ALLOWED : 'Access Restricted',
    ALLOWED : 'Access Granted',
    INVALID_FILTER : 'Invalid Filter',
    ACCOUNT_IS_DEACTIVATED : 'Account is deactivated',
    PRICING_SUCCESS : 'Pricing success',
    PRICING_FAILED : 'Pricing failed' ,
    PAYMENT_SUCCESS : 'Payment Success',
    PAYMENT_FAILED : 'Payment Failed',
    COURSE_SUSPENDED : 'Course is Suspended',
    COURSE_NOT_FOUND : 'Course not found',
    COURSE_ALREADY_ENROLLED : 'Course is already enrolled',
    COURSE_ACTIVE : 'Course is Active',
    COURSE_DETAILS_ERROR : 'Error loading course details',
    COURSE_DETAILS_SUCCESS : 'Loading course details successfully',
    PROGRESS_CHANGE_LESSON_STATUS_ERROR : 'change lesson status failed',
    PROGRESS_CHANGE_LESSON_STATUS_SUCCESS : 'change lesson status success',
    PROGRESS_CHANGE_MODULE_STATUS_ERROR : 'change module status failed',
    PROGRESS_CHANGE_MODULE_STATUS_SUCCESS : 'change module status success',
    LOADING_CURRENT_LESSON_ERROR : 'Loading current lesson error',
    LOADING_CURRENT_LESSON_SUCCESS :'Loading current lesson success',
    COURSE_PROGRESS_RESET_SUCCESS : 'Course Progress Reset Success',
    COURSE_PROGRESS_RESET_ERROR : 'Course progress reset failed',
    COURSE_COMPLETED : 'Course completed',
    COURSE_IS_ENROLLED : 'Course is enrolled',
    COURSE_NOT_ENROLLED : 'Course is not enrolled',
    PROGRESS_TRACKER_UPDATED_SUCCESS : 'Progress tracker updation success',
    PROGRESS_TRACKER_UPDATED_ERROR : 'Progress tracker is updation failed',
    PROGRESS_TRACKER_ALREADY_UPDATED : 'Progress tracker is already updated',
    PROGRESS_TRACKER_ALREADY_EXIST : 'Progress tracker is already exist',
    COURSE_IS_UPDATED : 'Course is updated',
    LOADING_WALLET_SUCCESS : 'Loading wallet details success',
    LOADING_WALLET_ERROR : 'Loading wallet details failed',
    ADDING_BANK_DETAILS_SUCCESS : 'Adding bank details success',
    ADDING_BANK_DETAILS_ERROR : 'Adding bank details Failed',
    LOADING_BANK_DETAILS_SUCCESS : 'Loadin Bank details Success',
    LOADING_BANK_DETAILS_ERROR : 'Loading Bank details Error',
    REQUEST_WITHDRAWAL_SUCCESS : 'Request withdrawal success',
    REQUEST_WITHDRAWAL_ERROR : 'Request withdrawal failed',
    INSUFFICIENT_FUNDS : 'Insufficient funds',
    LOAD_WITHDRAWAL_REQUEST_SUCCESS : 'Loading withdrawal request success',
    LOAD_WITHDRAWAL_REQUEST_FAILED : 'Loading withdrawal request failed',
    WITHDRAW_SUCCESS : 'Withdraw amount successfull',
    WITHDRAW_REQUEST_REJECTED : 'withdraw request rejected successfully', 
    WITHDRAW_REQUEST_APPROVED : 'withdraw request approved successfully', 
    INVALID_ACTION_TYPE : 'Invalid action type',
    LOAD_TRANSACTION_SUCCESS : 'Load transactions success',
    LOAD_TRANSACTION_FAILED : 'Load transactions failed',
    LOAD_BEST_SELLING_COURSE_SUCCESS : 'Load best selling courses success',
    LOAD_BEST_SELLING_COURSE_ERROR : 'Load best selling courses failed',
    LOAD_BEST_SELLING_CATEGORY_SUCCESS : 'Load best selling categories success',
    LOAD_BEST_SELLING_CATEGORY_FAILED : 'Load best selling categories failed',
    LOAD_DASHBOARD_DETAILS_SUCCESS : 'Load dashboard details success',
    LOAD_DASHBOARD_DETAILS_FAILED : 'Load dashboard details failed',
    LOAD_CHART_DATA_SUCCESS : 'Load Chart data success',
    LOAD_CHART_DATA_FAILED : 'Load Chart data failed',
    LOAD_CERTIFICATES_SUCCESS : 'Load certificates success',
    LOAD_CERTIFICATES_FAILED : 'Load certificates failed',
    MONTH_IS_REQURED : 'Month is required',
    GOOGLE_AUTH_EMAIL_ISSUE : 'Google auth users cannot change Email',
    GOOGLE_AUTH_PASSWORD_ISSUE : 'Google auth users cannot change Password'
})

export const DATABASE_FIELDS = Object.freeze({
    ID:'_id',
    NAME : 'name',
    FIRST_NAME : 'firstName',
    LAST_NAME : 'lastName',
    PASSWORD : 'password',
    EMAIL : 'email',
    PROFILE_IMAGE : 'profileImage',
    IS_ACTIVE : 'isActive',
    IS_VERIFIED : 'isVerified',
    IS_BLOCKED : 'isBlocked',
    IS_ADMIN_VERIFIED : 'isAdminVerified',
    EXPERTISE : 'expertise',
    EXPERIENCE : 'experience',
    BIO : 'bio',
    DOB :'dob',
    PHONE : 'phone',
    EARNINGS : 'earnings',
    STATUS : 'status',
    REASON : 'reason',
    ENROLLED_COURSES : 'enrolledCourses',
    TITLE : 'title',
    CATEGORY : 'category',
    ICON : 'icon',
    DESCRIPTION : 'description',
    GOOGLE_ID : 'googleID'
})
