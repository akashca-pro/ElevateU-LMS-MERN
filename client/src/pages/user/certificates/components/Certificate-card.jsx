import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import CertificateActions from "./Certificate-actions"
import { formatMinutesToHours } from "@/utils/formatHourIntoMinutes"

const CertificateCard = ({ certificate, onOpenCertificate }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <motion.div variants={cardVariants} whileHover={{ y: -8 }} transition={{ duration: 0.2 }} className="h-full">
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div
          className="aspect-[4/3] w-full bg-gradient-to-br from-primary/10 to-purple-500/10 relative cursor-pointer"
          onClick={() => onOpenCertificate(certificate)}
        >
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="border-4 border-primary/20 rounded-md w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Certificate of Completion</div>
                <div className="font-bold text-primary mt-1">{certificate.id.slice(0, 8)}</div>
              </div>
            </div>
          </div>

          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
            Completed
          </Badge>
        </div>

        <CardContent className="p-5 flex-grow flex flex-col">
          <div className="flex-grow">
            <h3 className="font-semibold text-lg line-clamp-2 mb-2">{certificate.courseName}</h3>

            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <span>Completed {formatDistanceToNow(new Date(certificate.completionDate), { addSuffix: true })}</span>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                {certificate.tutorName.charAt(0)}
              </div>
              <span className="text-sm">{certificate.tutorName}</span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {certificate.difficulty}
              </Badge>
              <span className="text-xs text-muted-foreground">{formatMinutesToHours(certificate?.duration)}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <CertificateActions certificate={certificate} onView={() => onOpenCertificate(certificate)} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default CertificateCard
