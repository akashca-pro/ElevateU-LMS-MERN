import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import OtpVerificationDialog from "./OtpVerificationDialog"

const formSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    confirmEmail: z.string().email("Please enter a valid email address"),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails do not match",
    path: ["confirmEmail"],
  })

export default function UpdateEmailForm({ updateEmail, verifyEmail }) {
  const [isOpen, setIsOpen] = useState(false)
  const [email,setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      confirmEmail: "",
    },
  })

  async function onSubmit(values) {
    const toastId = toast.loading('Please wait . . . ',{
      description : 'Sending otp'
    })
    try {
      setEmail(values.confirmEmail)
      await updateEmail({email : values.confirmEmail}).unwrap()
      toast.dismiss(toastId)
      setIsOpen(true)
    } catch (error) {
      toast.error('Error',{
        description : `${error?.data?.message}`,
        id : toastId
      })
      console.log(error)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your new email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Email</FormLabel>
                <FormControl>
                  <Input placeholder="Confirm your new email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <AnimatePresence>
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950/30 p-3 rounded-md"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Email updated successfully!</span>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Email"
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Form>
      <OtpVerificationDialog
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      useVerifyOtp={verifyEmail}
      email={email || 'Your Registered Email'}
      length={6}
      expiresIn={300} // seconds
      useResendOtp={updateEmail}
      resetForm={form.reset}
      toastMessage = {'Email Updated'}
    />
    </motion.div>
  )
}

