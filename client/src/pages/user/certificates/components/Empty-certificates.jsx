import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Award, BookOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"

const EmptyCertificates = () => {
  const navigate = useNavigate()

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative"
        initial={{ y: 10 }}
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", ease: "easeInOut" }}
      >
        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl opacity-70"></div>
        <Award className="h-24 w-24 text-primary relative" />
      </motion.div>

      <h2 className="text-2xl font-bold mt-6 mb-2">No Certificates Yet</h2>

      <p className="text-muted-foreground max-w-md mb-8">
        Complete courses to earn certificates that showcase your skills and achievements.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="default" className="gap-2" onClick={() => navigate('/explore')}>
          <BookOpen className="h-4 w-4" />
          <span>Explore Courses</span>
        </Button>

        <Button variant="outline" className="gap-2" onClick={() => navigate('/user/profile/my-courses') }>
          <span>My Courses</span>
        </Button>
      </div>
    </motion.div>
  )
}

export default EmptyCertificates
