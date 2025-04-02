import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useUserCourseDetailsQuery,useUserCourseCurrentStatusQuery } from '@/services/userApi/userLearningCourseApi.js'
import VideoPlayer from "./components/VideoPlayer"
import ModuleAccordion from "./components/ModuleAccordion"
import ProgressTracker from "./components/ProgressTracker"
import TutorView from "./components/TutorView"
import AttachmentsPage from "./components/AttachmentsPage"
import AchievementNotification from "./components/AchievementNotification"

const CourseLearningPage = () => {
  const navigate = useNavigate()
  const { courseId, lessonId } = useParams()

  const { data } = useUserCourseDetailsQuery(courseId)
  const { data : progress } = useUserCourseCurrentStatusQuery(courseId)
  console.log(data)
  console.log(progress)

  const [courseDetails,setCourseDetails] = useState(null)
  const [moduleDetails,setModuleDetails] = useState(null)
  const [progressDetails, setProgressDetails] = useState(null)

  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [completedLessons, setCompletedLessons] = useState([])
  const [showAchievement, setShowAchievement] = useState(false)
  const [achievementMessage, setAchievementMessage] = useState("")
  const [activeTab, setActiveTab] = useState("progress")

  useEffect(()=>{
    if(data){
      setCourseDetails(data?.data?.courseDetails)
      setModuleDetails(data?.data?.moduleDetails)
    }
  },[data])

  useEffect(()=>{
    if(progress){
      setProgressDetails(progress?.data)
    }
  },[progress])

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      // Simulate API call
      setTimeout(() => {
        const mockCourse = generateMockCourse()
        setCourse(mockCourse)

        // Set initial lesson
        if (lessonId) {
          const foundLesson = findLessonById(mockCourse, lessonId)
          if (foundLesson) {
            setCurrentLesson(foundLesson)
          } else {
            // If lesson not found, set first lesson
            const firstModule = mockCourse.modules[0]
            if (firstModule && firstModule.lessons.length > 0) {
              setCurrentLesson(firstModule.lessons[0])
            }
          }
        } else {
          // If no lesson ID in URL, set first lesson
          const firstModule = mockCourse.modules[0]
          if (firstModule && firstModule.lessons.length > 0) {
            setCurrentLesson(firstModule.lessons[0])
          }
        }

        // Set completed lessons (mock data)
        const mockCompletedLessons = ["lesson-1-1", "lesson-1-2", "lesson-2-1"]
        setCompletedLessons(mockCompletedLessons)

        setLoading(false)
      }, 1000)
    }

    fetchCourse()
  }, [lessonId])

  // Find lesson by ID helper
  const findLessonById = (course, id) => {
    if (!course || !course.modules) return null

    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (lesson.id === id) {
          return lesson
        }
      }
    }

    return null
  }

  // Handle lesson completion
  const handleLessonComplete = (lesson) => {
    if (!completedLessons.includes(lesson.id)) {
      const newCompletedLessons = [...completedLessons, lesson.id]
      setCompletedLessons(newCompletedLessons)

      // Calculate progress percentage
      const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0)
      const progressPercentage = Math.round((newCompletedLessons.length / totalLessons) * 100)

      // Check for achievements
      checkForAchievements(progressPercentage)

      // Update URL to next lesson if available
      const nextLesson = findNextLesson(lesson)
      if (nextLesson) {
        setCurrentLesson(nextLesson)
        navigate(`/course/${courseId}/lesson/${nextLesson.id}`)
      }
    }
  }

  // Find next lesson
  const findNextLesson = (currentLesson) => {
    if (!course || !currentLesson) return null

    let foundCurrent = false

    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (foundCurrent) {
          return lesson
        }

        if (lesson.id === currentLesson.id) {
          foundCurrent = true
        }
      }
    }

    return null // No next lesson (end of course)
  }

  // Handle lesson selection
  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson)
    navigate(`/course/${courseId}/lesson/${lesson.id}`)
  }

  // Check for achievements
  const checkForAchievements = (progressPercentage) => {
    if (progressPercentage === 25) {
      showAchievementNotification("25% Completed! You're making great progress! 🎉")
    } else if (progressPercentage === 50) {
      showAchievementNotification("Halfway there! Keep up the good work! 🚀")
    } else if (progressPercentage === 75) {
      showAchievementNotification("75% Complete! You're almost there! 💪")
    } else if (progressPercentage === 100) {
      showAchievementNotification("Congratulations! You've completed the course! 🏆")
    }
  }

  // Show achievement notification
  const showAchievementNotification = (message) => {
    setAchievementMessage(message)
    setShowAchievement(true)

    // Hide after 5 seconds
    setTimeout(() => {
      setShowAchievement(false)
    }, 5000)
  }


  // Generate mock course data
  const generateMockCourse = () => {
    // Create a larger set of modules for testing pagination
    const manyModules = []

    // First add the original 5 modules
    const originalModules = [
      {
        id: "module-1",
        title: "Introduction to Web Development",
        description: "Get started with the basics of web development",
        lessons: [
          {
            id: "lesson-1-1",
            title: "Welcome to the Course",
            description: "Introduction to the course and what you'll learn",
            videoUrl: "https://example.com/videos/lesson-1-1",
            duration: 10,
            attachments: [{ id: "att-1-1-1", title: "Course Overview", fileUrl: "#", fileType: "pdf" }],
          },
          {
            id: "lesson-1-2",
            title: "Setting Up Your Development Environment",
            description: "Install and configure the tools you'll need",
            videoUrl: "https://example.com/videos/lesson-1-2",
            duration: 15,
            attachments: [
              { id: "att-1-2-1", title: "Setup Guide", fileUrl: "#", fileType: "pdf" },
              { id: "att-1-2-2", title: "Troubleshooting Tips", fileUrl: "#", fileType: "pdf" },
            ],
          },
          {
            id: "lesson-1-3",
            title: "Understanding How the Web Works",
            description: "Learn about HTTP, browsers, and servers",
            videoUrl: "https://example.com/videos/lesson-1-3",
            duration: 20,
            attachments: [{ id: "att-1-3-1", title: "Web Architecture Diagram", fileUrl: "#", fileType: "pdf" }],
          },
        ],
      },
      {
        id: "module-2",
        title: "HTML Fundamentals",
        description: "Learn the building blocks of web pages",
        lessons: [
          {
            id: "lesson-2-1",
            title: "HTML Basics",
            description: "Introduction to HTML tags and structure",
            videoUrl: "https://example.com/videos/lesson-2-1",
            duration: 25,
            attachments: [{ id: "att-2-1-1", title: "HTML Cheat Sheet", fileUrl: "#", fileType: "pdf" }],
          },
          {
            id: "lesson-2-2",
            title: "HTML Forms and Inputs",
            description: "Create interactive forms with HTML",
            videoUrl: "https://example.com/videos/lesson-2-2",
            duration: 30,
            attachments: [{ id: "att-2-2-1", title: "Forms Exercise", fileUrl: "#", fileType: "zip" }],
          },
        ],
      },
      {
        id: "module-3",
        title: "CSS Styling",
        description: "Make your websites beautiful with CSS",
        lessons: [
          {
            id: "lesson-3-1",
            title: "CSS Basics",
            description: "Introduction to CSS selectors and properties",
            videoUrl: "https://example.com/videos/lesson-3-1",
            duration: 25,
            attachments: [{ id: "att-3-1-1", title: "CSS Cheat Sheet", fileUrl: "#", fileType: "pdf" }],
          },
          {
            id: "lesson-3-2",
            title: "CSS Layout Techniques",
            description: "Learn about Flexbox and Grid",
            videoUrl: "https://example.com/videos/lesson-3-2",
            duration: 35,
            attachments: [{ id: "att-3-2-1", title: "Layout Examples", fileUrl: "#", fileType: "zip" }],
          },
        ],
      },
      {
        id: "module-4",
        title: "JavaScript Essentials",
        description: "Add interactivity to your websites",
        lessons: [
          {
            id: "lesson-4-1",
            title: "JavaScript Basics",
            description: "Introduction to JavaScript syntax and concepts",
            videoUrl: "https://example.com/videos/lesson-4-1",
            duration: 30,
            attachments: [{ id: "att-4-1-1", title: "JavaScript Cheat Sheet", fileUrl: "#", fileType: "pdf" }],
          },
          {
            id: "lesson-4-2",
            title: "DOM Manipulation",
            description: "Learn to interact with the Document Object Model",
            videoUrl: "https://example.com/videos/lesson-4-2",
            duration: 40,
            attachments: [{ id: "att-4-2-1", title: "DOM Examples", fileUrl: "#", fileType: "zip" }],
          },
        ],
      },
      {
        id: "module-5",
        title: "Building Real Projects",
        description: "Apply your skills to build complete websites",
        lessons: [
          {
            id: "lesson-5-1",
            title: "Project Planning",
            description: "Learn how to plan and structure your projects",
            videoUrl: "https://example.com/videos/lesson-5-1",
            duration: 20,
            attachments: [{ id: "att-5-1-1", title: "Project Template", fileUrl: "#", fileType: "pdf" }],
          },
          {
            id: "lesson-5-2",
            title: "Building a Portfolio Website",
            description: "Create your own professional portfolio",
            videoUrl: "https://example.com/videos/lesson-5-2",
            duration: 60,
            attachments: [{ id: "att-5-2-1", title: "Portfolio Starter Files", fileUrl: "#", fileType: "zip" }],
          },
          {
            id: "lesson-5-3",
            title: "Course Conclusion",
            description: "Recap and next steps",
            videoUrl: "https://example.com/videos/lesson-5-3",
            duration: 15,
            attachments: [{ id: "att-5-3-1", title: "Further Learning Resources", fileUrl: "#", fileType: "pdf" }],
          },
        ],
      },
    ]

    manyModules.push(...originalModules)

    // Add additional modules for testing pagination
    for (let i = 6; i <= 15; i++) {
      manyModules.push({
        id: `module-${i}`,
        title: `Advanced Topic ${i - 5}`,
        description: `Exploring advanced concepts in web development - Part ${i - 5}`,
        lessons: [
          {
            id: `lesson-${i}-1`,
            title: `Advanced Topic ${i - 5} Introduction`,
            description: `Getting started with advanced topic ${i - 5}`,
            videoUrl: `https://example.com/videos/lesson-${i}-1`,
            duration: 20 + (i % 5),
            attachments: [{ id: `att-${i}-1-1`, title: `Topic ${i - 5} Overview`, fileUrl: "#", fileType: "pdf" }],
          },
          {
            id: `lesson-${i}-2`,
            title: `Advanced Topic ${i - 5} Deep Dive`,
            description: `In-depth exploration of advanced topic ${i - 5}`,
            videoUrl: `https://example.com/videos/lesson-${i}-2`,
            duration: 30 + (i % 10),
            attachments: [{ id: `att-${i}-2-1`, title: `Topic ${i - 5} Resources`, fileUrl: "#", fileType: "pdf" }],
          },
        ],
      })
    }

    return {
      id: "course-1",
      title: "Complete Web Development Bootcamp",
      description: "Learn web development from scratch with HTML, CSS, JavaScript, React, Node.js and more.",
      thumbnail: "/placeholder.svg?height=400&width=600&text=Course+Thumbnail",
      modules: manyModules,
      tutor: {
        id: "tutor-1",
        name: "Sarah Johnson",
        title: "Senior Web Developer & Instructor",
        bio: "Sarah has over 10 years of experience in web development and has taught thousands of students worldwide. She specializes in front-end technologies and loves making complex concepts easy to understand.",
        profileImage: "/placeholder.svg?height=200&width=200&text=SJ",
        expertise: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
        socialLinks: {
          website: "https://example.com",
          twitter: "https://twitter.com/example",
          github: "https://github.com/example",
          linkedin: "https://linkedin.com/in/example",
        },
      },
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[400px] bg-gray-200 rounded-lg"></div>
          <div className="h-[400px] bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Achievement Notification */}
      <AnimatePresence>
        {showAchievement && (
          <AchievementNotification message={achievementMessage} onClose={() => setShowAchievement(false)} />
        )}
      </AnimatePresence>

      {/* Course Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Course</span>
          </Button>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {courseDetails?.courseProgress}% Complete
          </Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {currentLesson ? currentLesson.title : "Loading lesson..."}
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 z-50">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border-0 shadow-lg">
            {currentLesson && (
              <VideoPlayer
                lesson={currentLesson}
                onComplete={() => handleLessonComplete(currentLesson)}
                isCompleted={completedLessons.includes(currentLesson.id)}
              />
            )}
          </Card>
        </div>

        {/* Module Accordion */}
        <div>
          <Card className="border-0 shadow-lg h-full">
            <ModuleAccordion
              course={courseDetails}
              moduleDetails={moduleDetails}
              progress={progressDetails}
              modules={course.modules}
              currentLessonId={currentLesson?.id}
              completedLessons={progress.completedLessons}
              onLessonSelect={handleLessonSelect}
            />
          </Card>
        </div>
      </div>

      {/* Tabbed Content */}
      <Card className="border-0 shadow-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress" className="text-sm md:text-base">
              Progress Tracker
            </TabsTrigger>
            <TabsTrigger value="tutor" className="text-sm md:text-base">
              Tutor Details
            </TabsTrigger>
            <TabsTrigger value="attachments" className="text-sm md:text-base">
              Attachments & Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="p-4 md:p-6">
            <ProgressTracker
              progress={progressDetails}
            />
          </TabsContent>

          <TabsContent value="tutor" className="p-4 md:p-6">
            <TutorView tutor={courseDetails?.tutor} />
          </TabsContent>

          <TabsContent value="attachments" className="p-4 md:p-6">
            <AttachmentsPage course={course} currentLesson={currentLesson} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

export default CourseLearningPage

