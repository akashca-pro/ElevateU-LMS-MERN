import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const EmptyCartComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-lg"
      >
        <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Start adding course to your cart now!</p>
      </motion.div>
    </div>
  );
};

export default EmptyCartComponent;