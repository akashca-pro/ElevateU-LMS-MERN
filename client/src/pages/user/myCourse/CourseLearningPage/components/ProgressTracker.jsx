import { useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, ChevronRight, Star, Trophy } from "lucide-react"

const ProgressTracker = ({ course, completedLessons, currentModule, nextModule, progressPercentage }) => {
  const svgRef = useRef(null)

  // Define level thresholds and names
  const levels = [
    { threshold: 0, name: "Beginner", description: "Starting your journey" },
    { threshold: 20, name: "Explorer", description: "Building foundations" },
    { threshold: 40, name: "Practitioner", description: "Gaining confidence" },
    { threshold: 60, name: "Specialist", description: "Mastering concepts" },
    { threshold: 80, name: "Expert", description: "Ready to apply skills" },
  ]

  // Get current level based on progress
  const getCurrentLevel = () => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (progressPercentage >= levels[i].threshold) {
        return levels[i]
      }
    }
    return levels[0]
  }

  // Get next level based on progress
  const getNextLevel = () => {
    for (let i = 0; i < levels.length; i++) {
      if (progressPercentage < levels[i].threshold) {
        return levels[i]
      }
    }
    return null // Already at max level
  }

  // Calculate total lessons
  const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0)

  // Calculate achievement message
  const getAchievementMessage = () => {
    if (progressPercentage === 100) {
      return "Congratulations! You've completed the entire course! 🏆"
    } else if (progressPercentage >= 75) {
      return "You're in the final stretch! Keep going strong! 💪"
    } else if (progressPercentage >= 50) {
      return "Halfway there! You're making excellent progress! 🚀"
    } else if (progressPercentage >= 25) {
      return "Great start! You're well on your way to mastery! 🌟"
    } else {
      return "Welcome to the course! Your learning journey begins here! 🎓"
    }
  }

  return (
    <div className="space-y-8">
      {/* Achievement Box */}
      <Card className="border-0 bg-gradient-to-r from-primary/10 to-purple-500/10 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="bg-primary/20 rounded-full p-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-1">{getCurrentLevel().name} Level</h3>
              <p className="text-gray-600 dark:text-gray-400">{getAchievementMessage()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* S-Curve Progress Path */}
      <div className="relative">
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
              transition={{ duration: 1.5, ease: "easeOut" }}
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
            const xPosition = (level.threshold / 100) * 1000
            const yPosition = index % 2 === 0 ? 100 + 40 : 100 - 40
            const isReached = progressPercentage >= level.threshold

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
                  className={`flex flex-col items-center`}
                >
                  <div
                    className={`rounded-full p-2 ${isReached ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    {isReached ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <span className="h-6 w-6 flex items-center justify-center font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`font-medium ${isReached ? "text-primary" : "text-gray-500"}`}>{level.name}</p>
                    <p className="text-xs text-gray-500">{level.threshold}%</p>
                  </div>
                </motion.div>
              </div>
            )
          })}

          {/* Current Progress Marker */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
            className="absolute bg-white rounded-full border-4 border-primary shadow-lg p-1"
            style={{
              left: `${progressPercentage}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Star className="h-5 w-5 text-primary fill-primary" />
          </motion.div>
        </div>
      </div>

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
                  {currentModule ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        In Progress
                      </Badge>
                      <span>{currentModule.title}</span>
                    </div>
                  ) : (
                    "Not started"
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Upcoming Module</TableCell>
                <TableCell>
                  {nextModule ? (
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      <span>{nextModule.title}</span>
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
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <span className="font-medium">{progressPercentage}%</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Lessons Completed</TableCell>
                <TableCell>
                  {completedLessons.length} of {totalLessons} lessons
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Current Level</TableCell>
                <TableCell>
                  <Badge className="bg-primary">{getCurrentLevel().name}</Badge>
                  <span className="ml-2 text-sm text-gray-500">{getCurrentLevel().description}</span>
                </TableCell>
              </TableRow>
              {getNextLevel() && (
                <TableRow>
                  <TableCell className="font-medium">Next Level</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getNextLevel().name}</Badge>
                    <span className="ml-2 text-sm text-gray-500">at {getNextLevel().threshold}% completion</span>
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
