import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { StepBasicDetails } from "./steps/Step-basic-details"
import { StepContent } from "./steps/Step-content"
import { StepPricing } from "./steps/Step-pricing"
import { StepPublish } from "./steps/Step-publish"
import { StepIndicator } from "./steps/Step-indicator"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { useTutorCreateCourseMutation } from '@/services/TutorApi/tutorCourseApi'


const courseFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  thumbnail: z.string().min(1,'Thumbnail is required'),
  modules: z
    .array(
      z.object({
        title: z.string().min(1, "Module title is required"),
        lessons: z.array(
          z.object({
            title: z.string().min(1, "Lesson title is required"),
            videoUrl: z.string().min(1, "Video URL is required"),
            attachments: z.array(z.string()).optional(),
          }),
        ),
      }),
    )
    .min(1, "At least one module is required"),
  price: z.number().min(0, "Price must be a positive number"),
  isFree: z.boolean().default(false),
  discount: z.number().min(0).max(100, "Discount must be between 0 and 100").default(0),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Beginner"),
  requirements: z.array(z.string()).default([]),
})

const defaultValues = {
  title: "",
  description: "",
  category: "",
  thumbnail: "",
  modules: [{ title: "", lessons: [{ title: "", videoUrl: "", attachments: [] }] }],
  price: 0,
  isFree: false,
  discount: 0,
  level: "Beginner",
  requirements: [""],
}


export function CourseCreationModal({ isOpen, onClose }) {
  const [createCourse] = useTutorCreateCourseMutation()
  const [step, setStep] = useState(1)
  const totalSteps = 4

  const form = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues,
    mode: "onChange",
    shouldFocusError: false
  })

  const {reset} = form

  const onSubmit = async (data) => {
    const toastId = toast.loading('Please wait . . . ');
    try {
      console.log("Form submitted:", data)
      await createCourse(data).unwrap()
      reset(defaultValues);
      toast.success("Course created successfully! Awaiting approval.",{id : toastId})
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to create course. Please try again.",{id : toastId})
    }
  }

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogTitle></DialogTitle>
        <div className="py-2">
          <StepIndicator currentStep={step} totalSteps={totalSteps} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
              {step === 1 && <StepBasicDetails form={form} nextStep={nextStep} />}
              {step === 2 && <StepContent form={form} nextStep={nextStep} prevStep={prevStep} />}
              {step === 3 && <StepPricing form={form} nextStep={nextStep} prevStep={prevStep} />}
              {step === 4 && <StepPublish form={form} prevStep={prevStep} onSubmit={form.handleSubmit(onSubmit)} />}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

