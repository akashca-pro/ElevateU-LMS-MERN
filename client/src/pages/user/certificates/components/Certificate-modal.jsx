import { motion } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { X, Award, Calendar, Clock, BookOpen, User } from "lucide-react"
import CertificateActions from "./Certificate-actions"
import { formatMinutesToHours } from '@/utils/formatHourIntoMinutes.js'

const CertificateModal = ({ certificate, isOpen, onClose }) => {

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2 },
    },
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-0 shadow-2xl">
        <motion.div className="relative" initial="hidden" animate="visible" exit="exit" variants={contentVariants}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="p-6 sm:p-10 flex flex-col items-center">
            {/* Certificate Display */}
            <motion.div
              className="w-full max-w-2xl mx-auto mb-8 relative"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="aspect-[1.4/1] w-full bg-gradient-to-br from-primary/5 via-purple-500/5 to-primary/5 rounded-lg border-2 border-primary/20 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">Verified</Badge>
                </div>

                <div className="mb-4">
                  <Award className="h-16 w-16 text-primary" />
                </div>

                <h2 className="text-2xl font-bold mb-1">Certificate of Completion</h2>
                <p className="text-muted-foreground mb-6">This certifies that</p>

                <h3 className="text-3xl font-bold mb-6 text-primary">{certificate?.userName}</h3>

                <p className="text-muted-foreground mb-2">has successfully completed the course</p>
                <h4 className="text-xl font-bold mb-6">{certificate?.title}</h4>

                <div className="flex items-center gap-2 mb-6">
                  <span className="text-muted-foreground">Issued on</span>
                  <span className="font-medium">{format(new Date(certificate?.completionDate), "MMMM dd, yyyy")}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Certificate ID</div>
                    <div className="font-mono text-sm">{certificate?.id}</div>
                  </div>

                  <Separator orientation="vertical" className="h-8" />

                  <div className="text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Instructor</div>
                    <div className="font-medium text-sm">{certificate?.tutorName}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Certificate Details */}
            <motion.div
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>Course Details</span>
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Course Name</span>
                    <span className="font-medium">{certificate?.courseName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Difficulty</span>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {certificate?.difficulty}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Duration</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{formatMinutesToHours(certificate?.duration)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Completion Date</span>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{format(new Date(certificate.completionDate), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Instructor Details</span>
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={`/placeholder.svg?text=${certificate?.tutorName.charAt(0)}`} />
                      <AvatarFallback>{certificate?.tutorName.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="font-medium">{certificate?.tutorName}</div>
                      <div className="text-sm text-muted-foreground">Course Instructor</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Expertise</span>
                    <span>Web Development</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rating</span>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="w-full mt-8 flex justify-end"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <CertificateActions certificate={certificate} onView={() => {}} />
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

export default CertificateModal
