import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom"; // React Router for navigation

export default function ErrorComponent({ message = "Something went wrong.", details, onRetry }) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen bg-white px-6 text-center space-y-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <AlertTriangle className="w-16 h-16 text-red-500" />
      <h2 className="text-2xl font-bold text-red-600">{message}</h2>
      {details && <p className="text-gray-600 max-w-md">{details}</p>}

      <div className="flex space-x-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            <RefreshCcw size={16} />
            Retry
          </button>
        )}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Home size={16} />
          Go Back Home
        </button>
      </div>
    </motion.div>
  );
}