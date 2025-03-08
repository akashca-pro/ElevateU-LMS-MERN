"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function StepPublish({ form, prevStep, onSubmit, categoryName}) {
  const formValues = form.getValues()
  const isFree = formValues.isFree

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review & Publish</h2>
        <p className="text-sm text-muted-foreground">Review your course details before submitting for approval.</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <h3 className="font-medium">Basic Details</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-sm font-medium">Title</p>
                  <p className="text-sm text-muted-foreground">{formValues.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">{categoryName}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{formValues.description}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Content</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {formValues.modules.length} module(s),{" "}
                {formValues.modules.reduce((acc, module) => acc + module.lessons.length, 0)} lesson(s)
              </p>
            </div>

            <div>
              <h3 className="font-medium">Pricing</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">
                    {isFree ? "Free" : `$${formValues.price}`}
                    {!isFree && formValues.discount > 0 && ` (${formValues.discount}% discount)`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Level</p>
                  <p className="text-sm text-muted-foreground">{formValues.level}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Requirements</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                {formValues.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Your course will be submitted for review. Once approved, it will be published and available to students.
          </AlertDescription>
        </Alert>

        <Alert variant="success" className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Ready to Submit</AlertTitle>
          <AlertDescription>
            You've completed all the required information for your course. Click "Submit for Approval" to proceed.
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep}>
          Previous Step
        </Button>
        <Button type="submit" onClick={onSubmit}>
          Submit for Approval
        </Button>
      </div>
    </div>
  )
}

