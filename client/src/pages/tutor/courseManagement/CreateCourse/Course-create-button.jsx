import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CourseCreationModal } from "./course-creation-modal"

export function CreateCourseButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Create Course
      </Button>
      <CourseCreationModal isOpen={isOpen} onClose={() => setIsOpen(false)}  />
    </>
  )
}

