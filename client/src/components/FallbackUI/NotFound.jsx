import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { BookX, Home, ArrowRight } from "lucide-react"
import Footer from "@/components/Footer"

const NotFound = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate("/")
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const numberVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.8,
      },
    },
  }

  const floatAnimation = {
    initial: { y: 0 },
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4 md:p-8 bg-gradient-to-b from-white to-purple-50">
        <motion.div className="max-w-3xl w-full" initial="hidden" animate="visible" variants={containerVariants}>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <motion.div className="flex-1 flex flex-col items-center md:items-start" variants={itemVariants}>
                <motion.div className="text-center md:text-left" variants={itemVariants}>
                  <motion.div
                    className="flex items-center gap-4 mb-6"
                    variants={floatAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <motion.div
                      className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text"
                      variants={numberVariants}
                    >
                      404
                    </motion.div>
                    <BookX className="h-12 w-12 md:h-16 md:w-16 text-purple-500" />
                  </motion.div>
                  <motion.h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4" variants={itemVariants}>
                    Page Not Found
                  </motion.h2>
                  <motion.p className="text-gray-600 mb-8 max-w-md" variants={itemVariants}>
                    Oops! The learning resource you're looking for seems to have gone missing from our library.
                  </motion.p>
                  <motion.div variants={itemVariants}>
                    <motion.button
                      onClick={handleGoHome}
                      className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Home className="h-5 w-5" />
                      <span>Return to Dashboard</span>
                      <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>

                <motion.div
                variants={itemVariants}
                  className="relative w-64 h-64 md:w-80 md:h-80"
                >
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <image href="/Lost.svg" width="380" height="290" x="-80" y="-40" />
                  </svg>
                </motion.div>
             
            </div>

            <motion.div
              className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 border-t border-purple-100"
              variants={itemVariants}
            >
              <p className="text-center text-gray-600 text-sm">
                Looking for something specific? Try searching or browsing our course catalog.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default NotFound