import { Search } from "lucide-react"
import { motion } from "framer-motion"

const HeroBanner = () => {
  return (
    <div className="relative bg-gradient-to-b from-[#F8F9FF] to-white min-h-[650px] flex items-center px-4 md:px-8 lg:px-12 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          className="space-y-8 max-w-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Find Your Preferred{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Courses
            </span>{" "}
            & Improve Your Skills
          </motion.h1>

          <motion.p
            className="text-gray-600 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Build skills with courses, certificates, and degrees online from world-class universities and companies.
          </motion.p>

          <motion.div
            className="relative max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
          </motion.div>

        </motion.div>

        <motion.div
          className="relative hidden lg:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
          <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>

          <motion.img
            src="/Hero_image.png"
            alt="Learning platform hero"
            className="w-full rounded-2xl relative z-10"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5 }}
          />

          {/* Floating badges */}
          <motion.div
            className="absolute top-10 -right-8 bg-white p-3 rounded-xl shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            style={{ zIndex: 20 }}
          >
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Expert Instructors</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default HeroBanner
