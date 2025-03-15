import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
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
import { Button } from "@/components/ui/button"


const courseFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  thumbnail: z.string().optional(),
  modules: z
    .array(
      z.object({
        title: z.string().min(1, "Module title is required"),
        lessons: z.array(
          z.object({
            title: z.string().min(1, "Lesson title is required"),
            videoUrl: z.string().min(1,'Video file is required'),
            attachments: z.array(z.string()).optional(),
            duration : z.number().min(0,'Duration is required')
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



export function CourseCreationModal({ isOpen, onClose }) {
  const [categoryName,setCategoryName] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [createCourse] = useTutorCreateCourseMutation()
  const [step, setStep] = useState(1)
  const totalSteps = 4

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

  const form = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues,
    mode: "onChange",
    shouldFocusError: false
  })

  const {reset, formState} = form

  const isDirty = formState.isDirty;

  const handleModalClose = () =>{
      if(isDirty){
        setShowConfirmModal(true);
      }else{
        onClose()
      }
  }

  const handleCancel = () =>{
    reset(defaultValues);
    setShowConfirmModal(false);
    onClose()
  }

  const onSubmit = async (data) => {
    const toastId = toast.loading('Please wait . . . ');
    try {
      console.log("Form submitted:", data)
      await createCourse({formData : data , draft : false}).unwrap()
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

  const handleDraft = async () => {
    const toastId = toast.loading('Saving current data . . .')
    try {
      const data = form.getValues();
      if(!data.title){
        toast.error('Atleast Course Title required to make a draft',{id : toastId})
        return
      }
      await createCourse({formData : data, draft : true }).unwrap()
      toast.success('Data saved as draft',{id : toastId})
      reset(defaultValues);
      setShowConfirmModal(false);
      onClose();
    } catch (error) {
      console.log(error)
      toast.error(error?.data?.message || 'Error saving data, try again later',{id : toastId})
    }
  }


  return (
    <>
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogTitle></DialogTitle>
        <div className="py-2">
          <StepIndicator currentStep={step} totalSteps={totalSteps} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
              {step === 1 && <StepBasicDetails form={form} nextStep={nextStep} setCategoryName={setCategoryName}/>}
              {step === 2 && <StepContent form={form} nextStep={nextStep} prevStep={prevStep} />}
              {step === 3 && <StepPricing form={form} nextStep={nextStep} prevStep={prevStep} />}
              {step === 4 && <StepPublish form={form} prevStep={prevStep} onSubmit={form.handleSubmit(onSubmit)} categoryName={categoryName}/>}
            </form>
          </Form>
        </div>
        <Button variant = 'outline' onClick ={handleDraft} >
          Save as Draft
        </Button>
      </DialogContent>
    </Dialog>

    {/* Confirmation modal */}
    <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
    <DialogContent className="sm:max-w-[400px]">
      <DialogTitle>Unsaved Changes</DialogTitle>
      <p>Do you want to save your progress as a draft before exiting?</p>
      <div className="flex justify-end gap-3 mt-4">
          <Button className=" bg-red-700 hover:bg-red-800 " onClick={handleCancel}>
              Cancel
          </Button>
          <Button  onClick={handleDraft}>
              Save as Draft
          </Button>
      </div>
      </DialogContent>
    </Dialog>
    </>
  )
}

