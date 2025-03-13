import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, User, Calendar, BookOpen, Clock, Filter, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import ConfirmDialog from "./ConfirmDialog";

const TutorVerificationRequest = ({ VerificationRequests, tutorApproveOrRequest,
    refetchVerificationRequest }) => {

    const [activeFilter, setActiveFilter] = useState("all")
      
    const filteredRequests =
    activeFilter === "all"
            ? [...VerificationRequests || []].sort((b,a)=> new Date(a.createdAt) - new Date(b.createdAt) ) 
            : activeFilter === 'recent' ? [...VerificationRequests].sort((b,a)=> new Date(a.createdAt) - new Date(b.createdAt) ) 
            : [...VerificationRequests || []].sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt) ) 
      

  return (
    <Card className="w-full shadow-md border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold text-gray-800">Tutor Verification Request</CardTitle>
                <CardDescription className="mt-1 flex items-center">
                  <Badge variant="secondary" className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                    {VerificationRequests?.length || 0}
                  </Badge>
                  pending requests require your review
                </CardDescription>
              </div>
    
              {VerificationRequests && VerificationRequests.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Filter className="h-3.5 w-3.5" />
                      Filter
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setActiveFilter("all")}>All Requests</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveFilter("recent")}>Recent First</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveFilter("oldest")}>Oldest First</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>
    
          <CardContent className="pt-6 px-6">
            {VerificationRequests && VerificationRequests.length > 0 ? (
              <Carousel
                className="w-full"
                opts={{
                  align: "start",
                  loop: false,
                }}
              >
                <CarouselContent className="-ml-4">
                  {filteredRequests?.map((tutor, index) => (
                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <TutorRequestCard
                        tutor={tutor}
                        tutorApproveOrReject={tutorApproveOrRequest}
                        refetchPublishRequest={refetchVerificationRequest}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-end gap-2 mt-4">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </Carousel>
            ) : (
              <div className="py-12 text-center">
                <div className="bg-gray-50 inline-flex rounded-full p-4 mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium mb-1">No pending requests</p>
                <p className="text-sm text-gray-400">All verification requests have been reviewed</p>
              </div>
            )}
          </CardContent>
        </Card>
  )
}

const TutorRequestCard = ({ tutor, tutorApproveOrReject, refetchVerificationRequest }) => {
    const { _id, firstName, lastName, profileImage, bio, experience, createdAt, expertise, email } = tutor;
  
    return (
      <Card className="overflow-hidden h-full border shadow-sm transition-all hover:shadow-md">
        {/* Tutor Profile Image */}
        <div className="relative flex justify-center p-4 bg-gray-100">
          <Avatar className="h-24 w-24 border-2 border-gray-300 rounded-full">
            <AvatarImage src={profileImage || "/placeholder.svg?height=100&width=100&text=Profile"} alt={firstName} />
            <AvatarFallback className="text-xl bg-primary/10 text-primary">
              {firstName?.charAt(0)}{lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg text-center mb-2">
            {firstName} {lastName}
          </h3>
          <p className="text-sm text-gray-600 text-center mb-3">{email}</p>
          <Badge className="block w-fit mx-auto bg-blue-500 hover:bg-blue-600">Pending Verification</Badge>
          
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              Joined: {createdAt ? format(new Date(createdAt), "MMM dd, yyyy") : "N/A"}
            </div>
            <div className="font-medium">Expertise: {expertise || "Not provided"}</div>
            <div className="font-medium">Experience: {experience ? `${experience} years` : "Not specified"}</div>
            <p className="text-gray-500 mt-2 line-clamp-2">{bio || "No bio available"}</p>
          </div>
        </div>
  
        {/* Approve/Reject Buttons */}
        <div className="p-4 grid grid-cols-2 gap-2">
          <ConfirmDialog
            btnName="Approve"
            btnClass="bg-green-500 hover:bg-green-600 text-white h-9 gap-1.5"
            title="Approve Tutor"
            description={`Are you sure you want to approve ${firstName} ${lastName}?`}
            action={tutorApproveOrReject}
            id={tutor._id}
            refetchData={refetchVerificationRequest}
          />
          <ConfirmDialog
            btnName="Reject"
            btnClass="bg-red-500 hover:bg-red-600 text-white h-9 gap-1.5"
            title="Reject Tutor"
            description={`Are you sure you want to reject ${firstName} ${lastName}?`}
            action={tutorApproveOrReject}
            id={tutor._id}
            refetchData={refetchVerificationRequest}
          />
        </div>
      </Card>
    );
  };

export default TutorVerificationRequest
