import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import CertificateActions from "./Certificate-actions"
import { formatMinutesToHours } from "@/utils/formatHourIntoMinutes"

const CertificateList = ({ certificates, onOpenCertificate }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
      {certificates.map((certificate) => (
        <motion.div key={certificate.id} variants={itemVariants} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-stretch">
              <div
                className="w-full sm:w-48 h-32 sm:h-auto bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center p-4 cursor-pointer"
                onClick={() => onOpenCertificate(certificate)}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-primary/20 rounded-md"></div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Certificate</div>
                    <div className="font-bold text-primary mt-1">{certificate.id.slice(0, 8)}</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">{certificate.courseName}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Completed {formatDistanceToNow(new Date(certificate.completionDate), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    >
                      {certificate.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <span>Instructor: {certificate.tutorName}</span>
                    <span className="mx-2">•</span>
                    <span>{formatMinutesToHours(certificate?.duration)}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <CertificateActions certificate={certificate} onView={() => onOpenCertificate(certificate)} />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default CertificateList
