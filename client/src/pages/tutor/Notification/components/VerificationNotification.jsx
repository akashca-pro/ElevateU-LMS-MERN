import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {Check} from 'lucide-react'
import {useTutorLoadProfileQuery} from '@/services/TutorApi/tutorProfileApi'
import { Button } from "@/components/ui/button";
import { useSelect } from "@/hooks/useSelect";


const VerificationNotification = ({markRead}) => {
    const {tutor} = useSelect()
    const {data : details} = useTutorLoadProfileQuery()
    const data = details?.data;
  return (
    <Card className="w-[380px]">
  <CardHeader>
    <CardTitle>Verification Status</CardTitle>
  </CardHeader>
  <CardContent className="grid gap-4">
    <div>
        <div
          className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
        >
          <span 
          className={`flex h-2 w-2 translate-y-1 rounded-full ${data?.isAdminVerified ? 'bg-green-500' : 'bg-red-500'} `} />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              status : {data?.status}
            </p>
            <p className="text-sm text-muted-foreground">
              Description : {data?.reason}
            </p>
          </div>
        </div>
    </div>
  </CardContent>
  <CardFooter>
    <Button 
    className="w-full" 
    onClick={markRead}
    >
      <Check /> Mark as read
    </Button>
  </CardFooter>
</Card>
  )
}

export default VerificationNotification
