import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function DeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsDeleting(false)
    setIsOpen(false)

    toast.success('Account deleted',{
      description: "Your account has been permanently deleted.",
    })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="space-y-4">
        <div className="bg-destructive/10 dark:bg-destructive/20 p-4 rounded-md border border-destructive/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-destructive">Warning: This action is irreversible</p>
              <p className="text-sm text-muted-foreground">
                Deleting your account will permanently remove all your data, including your profile, courses, and
                payment information. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove all your data from
                our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-2 py-2">
              <Label htmlFor="confirm" className="text-sm font-medium">
                Type <span className="font-semibold">delete my account</span> to confirm
              </Label>
              <Input
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="delete my account"
                className="w-full"
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault()
                  if (confirmText === "delete my account") {
                    handleDelete()
                  } else {
                    toast({
                      title: "Confirmation failed",
                      description: "Please type the confirmation text exactly as shown.",
                      variant: "destructive",
                    })
                  }
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={confirmText !== "delete my account" || isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  )
}

