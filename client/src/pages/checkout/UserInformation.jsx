import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

const UserInformation = ({ user }) => {
  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle>User Information</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <img src={user?.profileImage || "/placeholder.svg"} alt={user?.firstName} className="w-full h-full object-cover" />
          </div>

          <div>
            <h3 className="font-medium">{user?.firstName}</h3>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
        </div>

        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <Info className="h-4 w-4" />
          <AlertDescription>
            You'll be enrolled with the account information above. The course will be accessible immediately after
            payment.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

export default UserInformation

