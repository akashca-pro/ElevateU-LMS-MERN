import { useUserVerifyPaymentMutation} from '@/services/userApi/userCourseApi.js'

export const useRazorpayPayment = () => {

    const [verifyPayment] = useUserVerifyPaymentMutation(); 

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
                            await verifyPayment({ ...response, courseId : orderData?.courseId }).unwrap();
                            resolve({ success: true, message: "Payment successful" });
                        } catch (error) {
                            console.log(error);
                            resolve({ success: false, message: "Payment verification failed" });
                        }
                    },
                    prefill: {
                        name: orderData?.userData.name,
                        email: orderData?.userData.email,
                        contact: orderData?.userData.phone,
                    },
                    theme: {
                        color: "#3399cc",
                    },
                };

                const rzp = new window.Razorpay(options);

                rzp.open();
            });

    }
    return { handlePayment } 
}