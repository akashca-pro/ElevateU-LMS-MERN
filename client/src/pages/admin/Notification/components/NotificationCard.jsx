import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {useAdminVerificationRequestQuery, useAdminApproveOrRequestMutation} from '@/services/adminApi/adminTutorApi'
import { FilterBox } from "./FilterBox";
import ConfirmDialog from "./ConfirmDialog";


export function NotificationCard() {
  const {data, refetch} = useAdminVerificationRequestQuery()
  const [approveOrRequest,{error}] = useAdminApproveOrRequestMutation()

  return (
    <Card className="w-full p-6">
      <CardHeader>
        <div className="flex justify-between">
        <CardTitle>Tutor Verification Requests</CardTitle>
       {data && data.length > 0 && <FilterBox/>}
        </div>
        <CardDescription>You have {data && data.length} unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto">
            {data && data.map((tutor,index) => (
              <Card key={index} className="min-w-[300px] flex-shrink-0 border p-4">
                <CardContent className="flex items-start gap-2">
                  <div>
                    <p className="text-sm font-medium"> Name : {tutor.firstName}</p>
                    <p className="text-sm font-medium">Email : {tutor.email}</p>
                    <p className="text-sm font-medium">Status : {tutor.status}</p>
                  </div>
                </CardContent>
                <CardFooter className='flex gap-2'>
                    <ConfirmDialog 
                    btnName={'Approve'}
                    btnClass={"w-1/2 bg-green-700 hover:bg-green-800"}
                    action={approveOrRequest}
                    id={tutor?._id}
                    refetchData = {refetch}
                    />
                    <ConfirmDialog 
                    btnName={'Reject'}
                    btnClass={"w-1/2 bg-red-700 hover:bg-red-800"}
                    action={approveOrRequest}
                    id={tutor?._id}
                    refetchData = {refetch}
                    />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">No unread messages.</p>
        )}
      </CardContent>
    </Card>
  );
}