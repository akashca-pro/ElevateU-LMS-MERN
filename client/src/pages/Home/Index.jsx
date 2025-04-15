import { motion } from "framer-motion"
import HeroBanner from "./components/HeroBanner"
import TransformBanner from "./components/TransformBanner"
import CategoriesBanner from "./components/CategoriesBanner"
import FeaturedBanner from "./components/FeaturedBanner"
import TeachBanner from "./components/TeachBanner"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
    >
      <Navbar />
      <HeroBanner />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <CategoriesBanner />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <FeaturedBanner />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <TeachBanner />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <TransformBanner />
      </motion.div>
      <Footer />
    </motion.div>
  )
}

export default Index
