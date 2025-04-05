import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Play, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react"

const ModuleAccordion = ({ course ,moduleDetails, progress, currentLessonId, onLessonSelect }) => {
  const [openModules, setOpenModules] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const modulesPerPage = 3
  const totalPages = Math.ceil(course?.totalModules / modulesPerPage)

  // Find which module contains the current lesson and open it
//   useEffect(() => {
//     if (currentLessonId) {
//       let foundModuleIndex = -1

//       for (let i = 0; i < modules.length; i++) {
//         const module = modules[i]
//         for (const lesson of module.lessons) {
//           if (lesson.id === currentLessonId) {
//             foundModuleIndex = i
//             if (!openModules.includes(module.id)) {
//               setOpenModules((prev) => [...prev, module.id])
//             }
//             break
//           }
//         }
//         if (foundModuleIndex !== -1) break
//       }

//       // If found, navigate to the page containing this module
//       if (foundModuleIndex !== -1) {
//         const pageForModule = Math.floor(foundModuleIndex / modulesPerPage) + 1
//         setCurrentPage(pageForModule)
//       }
//     }
//   }, [currentLessonId, modules])

  // Toggle module open/close
  const toggleModule = (moduleId) => {
    if (openModules.includes(moduleId)) {
      setOpenModules(openModules.filter((id) => id !== moduleId))
    } else {
      setOpenModules([...openModules, moduleId])
    }
  }


  // Check if module is completed
  const isModuleCompleted = (moduleId) => {
    return progress?.completedModules.includes(moduleId)
  }

  // Get current page modules
  const getCurrentPageModules = () => {
    const startIndex = (currentPage - 1) * modulesPerPage
    const endIndex = startIndex + modulesPerPage
    return moduleDetails?.slice(startIndex, endIndex)
  }

  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Course Content</h2>
            <p className="text-sm text-gray-500 mt-1">
              {course?.totalModules} modules • {course?.totalLessons} lessons
            </p>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-grow">
        <Accordion type="multiple" value={openModules} className="w-full">
          {getCurrentPageModules()?.map((module, moduleIndex) => {
            const absoluteModuleIndex = (currentPage - 1) * modulesPerPage + moduleIndex

            return (
              <AccordionItem key={moduleIndex} value={module._id} className="border-b last:border-b-0">
                <AccordionTrigger
                  onClick={() => toggleModule(module._id)}
                  className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Module {absoluteModuleIndex + 1}:</span>
                      {isModuleCompleted(module._id) && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm">{module.title}</span>

                    <div className="w-full mt-2">
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>{moduleDetails.filter(m=>(m._id === module._id)).map(les=>les.totalLessons)} lessons</span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-0 py-0">
                  <div className="bg-gray-50 dark:bg-gray-800/50">
                    {module.lessonDetails.map((lesson, lessonIndex) => {
                      const isCompleted = lesson?.completedLessons.includes(lesson._id)
                      const isCurrent = lesson._id === currentLessonId

                      return (
                        <Button
                          key={lesson._id}
                          variant="ghost"
                          className={`w-full justify-start rounded-none border-l-2 px-4 py-3 text-left h-auto ${
                            isCurrent
                              ? "border-l-primary bg-primary/5 text-primary"
                              : "border-l-transparent hover:border-l-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                          onClick={() => onLessonSelect({ lessonId : lesson._id , moduleId : module._id })}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : isCurrent ? (
                                <PlayCircle className="h-5 w-5 text-primary" />
                              ) : (
                                <Play className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">
                                {absoluteModuleIndex + 1}.{lessonIndex + 1} {lesson.title}
                              </span>
                              <span className="text-xs text-gray-500 mt-1">{lesson.duration} min</span>
                            </div>
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </ScrollArea>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-3 border-t flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-sm text-gray-500">
            {currentPage} / {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default ModuleAccordion