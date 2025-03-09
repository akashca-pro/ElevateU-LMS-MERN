import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function ErrorComponent({ message = "Something went wrong.", onRetry }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen space-y-4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <AlertTriangle className="w-12 h-12 text-red-500" />
      <p className="text-red-600 text-lg font-semibold">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          <RefreshCcw size={16} />
          Retry
        </button>
      )}
    </motion.div>
  );
}