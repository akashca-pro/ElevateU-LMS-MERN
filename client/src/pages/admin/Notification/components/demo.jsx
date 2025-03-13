<Card className="w-full p-6">
      <CardHeader>
        <div className="flex justify-between">
        <CardTitle>Tutor Verification Requests</CardTitle>
       {VerificationRequests && VerificationRequests.length > 0 && <FilterBox/>}
        </div>
        <CardDescription>You have {VerificationRequests && VerificationRequests.length} unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        {VerificationRequests && VerificationRequests.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto">
            {VerificationRequests && VerificationRequests.map((tutor,index) => (
              <Card key={index} className="min-w-[300px] flex-shrink-0 border p-4">
                <CardContent className="flex items-start gap-2">
                  <div>
                    <p className="text-sm font-medium">Name : {tutor.firstName}</p>
                    <p className="text-sm font-medium">Email : {tutor.email}</p>
                    <p className="text-sm font-medium">Status : {tutor.status}</p>
                  </div>
                </CardContent>
                <CardFooter className='flex gap-2'>
                    <ConfirmDialog 
                    btnName={'Approve'}
                    btnClass={"w-1/2 bg-green-500 hover:bg-green-600"}
                    action={tutorApproveOrRequest}
                    id={tutor?._id}
                    refetchData = {refetchVerificationRequest}
                    />
                    <ConfirmDialog 
                    btnName={'Reject'}
                    btnClass={"w-1/2 bg-red-500 hover:bg-red-600"}
                    action={tutorApproveOrRequest}
                    id={tutor?._id}
                    refetchData = {refetchVerificationRequest}
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