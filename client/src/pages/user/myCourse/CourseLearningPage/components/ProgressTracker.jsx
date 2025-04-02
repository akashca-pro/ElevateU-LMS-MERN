import { useEffect, useRef, useState } from "react"
import Confetti from "react-confetti";
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, ChevronRight, Star, Trophy } from "lucide-react"

const ProgressTracker = ({ progress }) => {
  const [showConfetti, setShowConfetti] = useState(false);
    
  useEffect(() => {
    if (progress.courseProgress === 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // Stop after 5 seconds
    }
  }, [progress.courseProgress]);


  const svgRef = useRef(null)
  const currentLevelIndex = progress.currentLevel - 1 // Convert to 0-based index

  // Define level thresholds and names
  const levels = [
    { level: 1, name: "Beginner", threshold: 0, description: "Starting your journey" },
    { level: 2, name: "Explorer", threshold: 25, description: "Building foundations" },
    { level: 3, name: "Practitioner", threshold: 50, description: "Gaining confidence" },
    { level: 4, name: "Specialist", threshold: 75, description: "Mastering concepts" },
    { level: 5, name: "Expert", threshold: 100, description: "Ready to apply skills" },
  ]

  // Get current level data
  const currentLevel = levels[currentLevelIndex]
  const nextLevel = levels[currentLevelIndex + 1]

  // Calculate progress percentage
  const progressPercentage = progress.courseProgress || 0

  // Calculate achievement message
  const getAchievementMessage = (progressPercentage) => {
    if (progressPercentage === 100) {
      return "Congratulations! You've completed the entire course! �"
    } else if (progressPercentage >= 75) {
      return "You're in the final stretch! Keep going strong! 💪"
    } else if (progressPercentage >= 50) {
      return "Halfway there! You're making excellent progress! �"
    } else if (progressPercentage >= 25) {
      return "Great start! You're well on your way to mastery! 🌟"
    } else {
      return "Welcome to the course! Your learning journey begins here! 🎓"
    }
  }

  return (
    <div className="space-y-8">
      {showConfetti && <Confetti />}
      {/* Achievement Box */}
      <Card className="border-0 bg-gradient-to-r from-primary/10 to-purple-500/10 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="bg-primary/20 rounded-full p-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-1">{currentLevel.name} Level</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {levels[currentLevelIndex].description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* S-Curve Progress Path */}
      {progress.levelSize === 5 && <div className="relative">
        <div className="w-full h-[200px] overflow-hidden">
          <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
            {/* S-Curve Path Background */}
            <path
              d="M0,100 C250,180 350,20 500,100 C650,180 750,20 1000,100"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Progress Path */}
            <motion.path
              d="M0,100 C250,180 350,20 500,100 C650,180 750,20 1000,100"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progressPercentage / 100 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Gradient Definition */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Level Markers */}
          {levels.map((level, index) => {
            const isReached = index <= currentLevelIndex
            const isCurrent = index === currentLevelIndex
            const isTextAbove = level.name === "Explorer" || level.name === "Specialist"

            return (
              <div
                key={index}
                className="absolute transform -translate-x-1/2"
                style={{
                  left: `${level.threshold}%`,
                  top: index % 2 === 0 ? "60%" : "30%",
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5, type: "spring" }}
                  className="flex flex-col items-center"
                >
                  {/* Level Circle */}
                  <div
                    className={`rounded-full p-2 ${
                      isReached ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isReached ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <span className="h-6 w-6 flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Level Text */}
                  <div className={`mt-2 text-center ${isTextAbove ? "order-first mb-2" : "mt-2"}`}>
                    <p className={`font-medium ${isReached ? "text-primary" : "text-gray-500"}`}>
                      {level.name}
                    </p>
                    <p className="text-xs text-gray-500">{level.threshold}%</p>
                  </div>

                  {/* Current Level Marker */}
                  {isCurrent && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1, type: "spring" }}
                      className="absolute -top-12 bg-white rounded-full border-4 border-primary shadow-lg p-1"
                    >
                      <Star className="h-5 w-5 text-primary fill-primary" />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>}

      {/* Progress Stats Table */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>Progress Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Current Module</TableCell>
                <TableCell>
                  {progress.currentModule ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        In Progress
                      </Badge>
                      <span>{progress.currentModule.title}</span>
                    </div>
                  ) : (
                    "Not started"
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Upcoming Module</TableCell>
                <TableCell>
                  {progress.upcomingModule._id ? (
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      <span>{progress.upcomingModule.title}</span>
                    </div>
                  ) : (
                    "Course completion"
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Progress</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-full max-w-[200px] h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.moduleProgress}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <span className="font-medium">{progress.moduleProgress}%</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Lessons Completed</TableCell>
                <TableCell>
                  {progress.completedLessons} of {progress.totalLessons} lessons
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Current Level</TableCell>
                <TableCell>
                  <Badge className="bg-primary">{currentLevel.name}</Badge>
                  <span className="ml-2 text-sm text-gray-500">{currentLevel.description}</span>
                </TableCell>
              </TableRow>
              {nextLevel && (
                <TableRow>
                  <TableCell className="font-medium">Next Level</TableCell>
                  <TableCell>
                    <Badge variant="outline">{nextLevel.name}</Badge>
                    <span className="ml-2 text-sm text-gray-500">
                      at {nextLevel.threshold}% completion
                    </span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProgressTracker