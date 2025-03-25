import { useUserVerifyPaymentMutation, useUserFailedPaymentMutation} from '@/services/userApi/userCourseApi.js'

export const useRazorpayPayment = () => {

    const [verifyPayment] = useUserVerifyPaymentMutation(); 
    const [failedPayment] = useUserFailedPaymentMutation();

    const handlePayment = async (orderData) => {
            return new Promise((resolve) => {
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: orderData?.price.finalPrice * 100, // Convert to paise
                    currency: 'INR',
                    order_id: orderData?.paymentDetails.orderId,
                    name: "ElevateU",
                    description: "Course Enrollment",
                    handler: async (response) => {
                        try {
                            const res = await verifyPayment(response).unwrap();
                            resolve({ success: true, message: "Payment successful" , paymentDetails : {
                                orderId : res?.data?.orderId,
                                transactionId : res?.data?.transactionId,
                                amountPaid : res?.data?.amountPaid
                            }});
                        } catch (error) {
                            console.log(error);
                            resolve({ success: false, message: "Payment verification failed" });
                        }
                    },
                    prefill: {
                        name: orderData?.userData.name,
                        email: orderData?.userData.email
                    },
                    theme: {
                        color: "#3399cc",
                    },
                    modal : {
                        ondismiss : async() => {

                            try {
                                await failedPayment(orderData._id).unwrap()
                            } catch (error) {
                                console.error("Failed to update failed transactions:", error);
                            }
                            resolve({ success: false, message: "Payment verification failed" });
                        }
                        
                    }
                };

                const rzp = new window.Razorpay(options);

                rzp.open();
            });

    }
    return { handlePayment } 
}