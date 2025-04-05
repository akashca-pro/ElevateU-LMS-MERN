import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import Confetti from "react-confetti";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {ChevronLeft} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useUserCourseDetailsQuery,useUserCourseCurrentStatusQuery, useLoadLessonDetailsQuery
  ,useLessonOrModuleStatusChangeMutation, useResetCourseProgressMutation, useCheckEnrollmentQuery
  ,useUpdateProgressTrackerMutation
 } from '@/services/userApi/userLearningCourseApi.js'
import VideoPlayer from "./components/VideoPlayer"
import ModuleAccordion from "./components/ModuleAccordion"
import ProgressTracker from "./components/ProgressTracker"
import TutorView from "./components/TutorView"
import AttachmentsPage from "./components/AttachmentsPage"
import AchievementNotification from "./components/AchievementNotification"
import NotEnrolledCard from "@/components/FallbackUI/NotEnrolledCard"
import { toast } from "sonner";
import CourseCompletionDialog from "./components/CourseCompletionDialog";

const CourseLearningPage = () => {
  
  const navigate = useNavigate()
  const { courseId } = useParams()

  const [updateLessonProgress] = useLessonOrModuleStatusChangeMutation()
  const [resetCourseProgress] = useResetCourseProgressMutation()
  const [updateProgressTracker] = useUpdateProgressTrackerMutation()

  const { data : course, refetch : refetchCourseDetails, isLoading : courseLoading}
  = useUserCourseDetailsQuery(courseId)

  const { data : progress, refetch : refetchProgressDetails, isLoading : progressLoading } 
  = useUserCourseCurrentStatusQuery(courseId)

  const [courseDetails,setCourseDetails] = useState(null)
  const [moduleDetails,setModuleDetails] = useState(null)
  const [progressDetails, setProgressDetails] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)

  const { data : lessonDetails } = useLoadLessonDetailsQuery({

    courseId : courseDetails?._id,
    lessonId : selectedModule?.lessonId,
    moduleId : selectedModule?.moduleId

   },{ skip : !courseDetails || !selectedModule })

  const [showAchievement, setShowAchievement] = useState(false)
  const [achievementMessage, setAchievementMessage] = useState("")
  const [isModalOpen,setIsModalOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState("progress")

  useEffect(()=>{

    if(course){
      setCourseDetails(course?.data?.courseDetails)
      setModuleDetails(course?.data?.moduleDetails)
    }

    if(progress){
      setProgressDetails(progress?.data)
      setCurrentLesson(progress?.data?.currentLesson)
    }

    if(lessonDetails?.data){
      setCurrentLesson(lessonDetails?.data)
    }
    
  },[course, progress, lessonDetails, courseId])

  useEffect(()=>{
    handleUpdateProgress()
  },[courseId])
  
  // check and update progress tracker if any changes to module or lesson
  const handleUpdateProgress = async () => {
  
    try {
      const res = await updateProgressTracker(courseId).unwrap()
      refetchCourseDetails()
      refetchProgressDetails()
      if(res.data){
        toast.success('Progress tracker updated',{ description : 'New modules or lessons added' })
      }
    } catch (error) {
      toast.error("Failed to update progress tracker");
      console.log(error)
    }
    
  }
  
  useEffect(() => {
    if (progressDetails?.courseProgress === 100) {
      setShowConfetti(true);
      setTimeout(() => setIsModalOpen(true), 4000); 
    }
  }, [progressDetails?.courseProgress]);

  const handleOpenChange = () =>{
      setIsModalOpen((prev)=>!prev);
      setShowConfetti(false)
  }

  // Handle reset progress
  const handleResetProgress = async()=>{
    try {
      await resetCourseProgress(courseDetails?._id).unwrap()
      refetchCourseDetails()
      refetchProgressDetails()
      toast.success('Course Progress Resetted',{
        description : 'Now you can start over again !'
      })
      setShowConfetti(false)
      setIsModalOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  // Handle lesson completion
  const handleLessonComplete = async(lesson) => {

    const credentials = {
      courseId,
      lessonId : lesson._id,
      moduleId : lesson.moduleId
    }

    try {
       await updateLessonProgress({...credentials}).unwrap()
    } catch (error) {
      console.log(error)
    }

  }

  // Handle lesson selection
  const handleLessonSelect = (moduleDetails) => {
    setSelectedModule(moduleDetails)
  }

  // Check for achievements
  const checkForAchievements = (progressPercentage) => {
    if (progressPercentage === 25 ) {
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

  if (courseLoading || progressLoading) {
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
      {showConfetti && <Confetti />}
      {/* Achievement Notification */}
      <AnimatePresence>
        {showAchievement && (
          <AchievementNotification message={achievementMessage} onClose={() => setShowAchievement(false)} />
        )}
      </AnimatePresence>

        {/* Progress reset */}
        <CourseCompletionDialog isOpen={isModalOpen} onOpenChange={setIsModalOpen}
         handleResetProgress={handleResetProgress} title={courseDetails?.title}/>

      {/* Course Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Course</span>
          </Button>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {progressDetails?.courseProgress}% Complete
          </Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">{courseDetails?.title}</h1>
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
                isCompleted={currentLesson.isCompleted}
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
              currentLessonId={currentLesson?._id}
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
              setIsModalOpen={setIsModalOpen}
            />
          </TabsContent>

          <TabsContent value="tutor" className="p-4 md:p-6">
            <TutorView tutor={courseDetails?.tutor} />
          </TabsContent>

          <TabsContent value="attachments" className="p-4 md:p-6">
            <AttachmentsPage course={courseDetails} currentLesson={currentLesson?.attachments}  />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

export default CourseLearningPage

