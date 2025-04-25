import { motion } from "framer-motion"
import CertificateCard from "./Certificate-card"

const CertificateGrid = ({ certificates, onOpenCertificate }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {certificates.map((certificate) => (
        <CertificateCard key={certificate.id} certificate={certificate} onOpenCertificate={onOpenCertificate} />
      ))}
    </motion.div>
  )
}

export default CertificateGrid
