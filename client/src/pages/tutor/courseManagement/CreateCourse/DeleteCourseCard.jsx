import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Trash2 } from "lucide-react"

const DeleteCourseCard = ({ courseTitle, onDelete }) => {
  const [confirmTitle, setConfirmTitle] = useState("")

  const handleDelete = () => {
    if (confirmTitle.toLowerCase() === courseTitle.toLowerCase()) {
      onDelete()
    } else {
      alert("Course title doesn't match. Please try again.")
    }
  }

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Delete Course
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Deleting this course is irreversible. All content, student progress, and associated data will be permanently
            removed.
          </AlertDescription>
        </Alert>

        <div className="text-sm text-muted-foreground space-y-2">
          <p>Please read the following disclaimers carefully:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>This action cannot be undone.</li>
            <li>All enrolled students will lose access to the course content.</li>
            <li>You will no longer receive any revenue from this course.</li>
            <li>Course ratings and reviews will be permanently deleted.</li>
            <li>Any certificates issued for this course will become invalid.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-title">Type the course title to confirm deletion:</Label>
          <Input
            id="confirm-title"
            type="text"
            placeholder={`Type "${courseTitle}" to confirm`}
            value={confirmTitle}
            onChange={(e) => setConfirmTitle(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={confirmTitle.toLowerCase() !== courseTitle.toLowerCase()}
          className="w-full"
        >
          I understand, delete this course permanently
        </Button>
      </CardFooter>
    </Card>
  )
}

export default DeleteCourseCard

