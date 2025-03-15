import { useState, useEffect, useRef } from "react"
import equal from "fast-deep-equal"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Edit2, Plus, Clock, Users, BookOpen, Award, Copy, Car, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useTutorLoadCourseQuery, useTutorUpdateCourseMutation, useTutorDeleteCourseMutation, 
  useTutorPublishCourseMutation
} from "@/services/TutorApi/tutorCourseApi"
import { useLoadCategoriesQuery } from '@/services/commonApi'
import { format } from "date-fns"
import LoadingSpinner from "@/components/FallbackUI/LoadingSpinner"
import ErrorComponent from "@/components/FallbackUI/ErrorComponent"
import { VideoUpload } from "./CreateCourse/VideoUpload"
import { ImageUpload } from "./CreateCourse/ImageUpload"
import { FileUpload } from "./CreateCourse/FileUpload"
import { toast } from "sonner"
import DeleteCourseCard from "./CreateCourse/DeleteCourseCard"
import validateUpdatedData from "./CreateCourse/validateUpdatedData"


const CourseDetails = () => {
  const { courseId } = useParams()
  const navigate = useNavigate();
  const [updateCourse,{isLoading : isUpdating}] = useTutorUpdateCourseMutation()
  const [deleteCourse] = useTutorDeleteCourseMutation()
  const [publishCourse,{}] = useTutorPublishCourseMutation()
  const [course, setCourse] = useState(null)
  const [categories,setCategories] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDataChanged,setIsDataChanged] = useState(false)
  const [prevData,setPrevData] = useState(null)
  const [formErrors,setFormErrors] = useState(null)
  const editSectionRef = useRef(null)

  const { data: courseDetails, isLoading, isError, refetch } = useTutorLoadCourseQuery(courseId)
  const { data : categoryDetails } = useLoadCategoriesQuery()

  useEffect(() => {
    if (courseDetails?.data) {
      setCourse(JSON.parse(JSON.stringify(courseDetails.data)));
      setPrevData(course)
    }
    setCategories(categoryDetails?.data)

  }, [courseDetails, isEditing, categoryDetails]);

  const handleEdit = () => {
    setIsEditing(true)
    editSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const handleSave = async () => {
    const toastId = toast.loading('Updating data . . . ')
    try {
       
      const errors = validateUpdatedData(course)
      setFormErrors(errors)
      console.log(course)
      await updateCourse({formData : course}).unwrap()
      toast.success('Data updated successfully',{id : toastId});
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving course:", error)
      toast.error('Data updation failed, please try again later',{id : toastId});
    }
  }

  const handleImageChange = (uploadedImageUrl = null)=>{
    setCourse({ ...course, thumbnail : uploadedImageUrl });
    setIsDataChanged(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCourse({ ...course, [name]: value })
    setIsDataChanged(true)
  }

  const handleInputArrayChange = (field, index, value) => {
    setCourse({...course, 
      [field] : course[field].map((item,i)=> i===index ? value : item )
     });
     setIsDataChanged(true)
  }

  const handleRemoveArrayItems = (field, index) =>{
      setCourse({ ...course,
        [field] : course[field].filter((_,i)=> i!==index )
      })
      setIsDataChanged(true)
  }

  const handleInputAddItemsToArray = (field) =>{
    setCourse({...course,
      [field] : [...course[field], '']
    })
    setIsDataChanged(true)
  }

  const handleSwitchChange = (name) => {
    setCourse({ ...course, [name]: !course[name] })
    setIsDataChanged(true)
  }

  const handleSelectChange = (name, value) => {
    setCourse({ ...course, [name]: value })
    setIsDataChanged(true)
  }

  const handleAddModule = () => {
    const courseCopy = JSON.parse(JSON.stringify(course));
    courseCopy.modules.push({ title: "", lessons: [] });
    setCourse(courseCopy);
    setIsDataChanged(true)
  }

  const handleAddLesson = (moduleIndex) => {
    const courseCopy = JSON.parse(JSON.stringify(course));
    courseCopy.modules[moduleIndex].lessons.push({
      title: "",
      videoUrl: "",
      duration: 0,
      attachments: [],
    });
    setCourse(courseCopy);
    setIsDataChanged(true)
  }

  const handleModuleChange = (index, field, value) => {
   const courseCopy = JSON.parse(JSON.stringify(course))
   courseCopy.modules[index][field] = value;
   setCourse(courseCopy);
   setIsDataChanged(true)
   setIsDataChanged(true)
  }

  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    const courseCopy = JSON.parse(JSON.stringify(course))
    courseCopy.modules[moduleIndex].lessons[lessonIndex][field] = value;
    setCourse(courseCopy);
    setIsDataChanged(true)
  }
  
  const handleDeleteCourse = async() =>{
    const toastId = toast.loading('Deleting course . . .');
      try {
        await deleteCourse(course._id).unwrap();
        toast.success('Course deleted successfully',{id : toastId});
        navigate(-1)
      } catch (error) {
        console.log(error)
        toast.error('Course deletion failed',{id : toastId});
      }
  }

  const handleSubmitApproval = async() =>{
    const toastId = toast.loading('Please Wait . . . ')
    try {
       const response = await publishCourse({courseId : course._id}).unwrap()
       toast.success(response?.message,{id : toastId , duration : 5000})
    } catch (error) {
      console.log(error)
      toast.error(error?.data?.message,{id : toastId})
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "Pending Approval",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
      },
      draft: { label: "Draft", color: "bg-yellow-100 text-yellow-800 border-gray-200 hover:bg-gray-200" },
      approved: { label: "Approved", color: "bg-green-100 text-green-500 border-green-200 hover:bg-green-200" },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-500 border-red-200 hover:bg-red-200" },
      none: { label: "none", color: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200" },
    }

    const config = statusConfig[status] || statusConfig.draft

    return (
      <Badge variant="outline" className={`${config.color} font-medium py-1 px-3`}>
        {config.label}
      </Badge>
    )
  }

  if (isLoading) {
    return (
     <LoadingSpinner/>
    )
  }

  if (isError) {
    return (
      <ErrorComponent onRetry={refetch} />
    )
  }

  if (!course) {
    return <div>Loading...</div>
  }

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
  const totalDuration = course.modules.reduce(
    (acc, module) => acc + module.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0),
    0,
  )

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground mt-1">
            Last updated: {course.updatedAt ? format(new Date(course.updatedAt), "MMMM dd, yyyy") : "N/A"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(course.status)}
          {!isEditing && (
            <Button
             onClick={handleEdit} className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" /> Edit Course
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Thumbnail and Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-xl overflow-hidden border shadow-sm bg-card">
            <div className="absolute top-4 right-4 z-10">{getStatusBadge(course.status)}</div>
            <img
              src={course.thumbnail || "/placeholder.svg?height=600&width=1200&text=Course+Thumbnail"}
              alt={course.title}
              className="w-full h-[400px] object-cover"
            />
            <div className="p-6 bg-gradient-to-t from-black/60 to-transparent absolute bottom-0 left-0 right-0 text-white">
              <h2 className="text-2xl font-bold">{course.title}</h2>
              <p className="line-clamp-2 text-white/90 mt-2">{course.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Modules</p>
                <p className="text-2xl font-bold">{course.modules.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Award className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Lessons</p>
                <p className="text-2xl font-bold">{totalLessons}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Clock className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-2xl font-bold">{totalDuration} min</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Users className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Enrolled</p>
                <p className="text-2xl font-bold">{course.totalEnrollment || 0}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Status Card */}
        <div className="space-y-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle>Course Status</CardTitle>
              <CardDescription>Current publication status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status:</span>
                  {getStatusBadge(course.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Published:</span>
                  <Badge variant={course.isPublished ? "default" : "outline"}>
                    {course.isPublished ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Level:</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                    {course.level}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Price:</span>
                  <span className="font-bold">
                    {course.isFree ? "Free" : `$${course.price}`}
                    {!course.isFree && course.discount > 0 && (
                      <span className="ml-2 text-sm text-green-600">(-{course.discount}%)</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Created:</span>
                  <span className="text-sm text-muted-foreground">
                    {course.createdAt ? format(new Date(course.createdAt), "MMM dd, yyyy") : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" /> View Enrollments
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Award className="mr-2 h-4 w-4" /> View Analytics
              </Button>
              {course.status !== "approved" && (
                <Button 
                onClick={handleSubmitApproval}
                disabled = {course?.status === 'pending' || course?.status === 'approved' || isEditing}
                className="w-full justify-start" variant="default">
                  <Clock className="mr-2 h-4 w-4" />
                   {course?.status === 'pending' 
                   ? 'Request Pending' 
                   : course?.status === 'approved'
                   ? 'Already approved' 
                   : 'Submit for Approval'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="details" className="mt-8" ref={editSectionRef}>
        <TabsList>
          <TabsTrigger value="details">Course Details</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="delete">Delete Course</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
        <p className="text-sm text-gray-600 italic bg-gray-100 p-2 rounded-md border-l-4 border-blue-500">
  <span className="font-semibold">NB:</span> Publishing request will be accepted after required fields are filled.
</p>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Course Details
                {!isEditing ? (
                  <Button onClick={handleEdit}>
                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                  </Button>
                ) : ( <div className="flex gap-2" >
                  <Button disabled = {!isDataChanged} onClick={handleSave}>Save Changes</Button>
                  <Button variant='destructive' onClick={()=>(setIsEditing((prev)=>!prev) , setIsDataChanged(false))}>Cancel</Button>
                </div> )}
                 
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={course?.title}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <p className={`${formErrors?.title ? 'text-red-500' : 'text-blue-500' } text-sm font-semibold opacity-80`}>
                  {formErrors ? formErrors.title : 'Required Field'} 
                </p>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={course?.description}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="min-h-[150px]"
                  />
                  <p className={`${formErrors?.description ? 'text-red-500' : 'text-blue-500' } text-sm font-semibold opacity-80`}>
                  {formErrors ? formErrors.description : 'Required Field'} 
                </p>
                </div>

                <div className="space-y-2 mt-4 md:mt-6 lg:mt-8">
                <Label>What you learn (Description) </Label>
                {course?.whatYouLearn.map((field,index) => (
                 <div key={index} className="flex items-center gap-2">
                    <Input type = 'text'
                      name= 'whatYouLearn'
                      value = {field}
                      placeholder = {`Description ${index + 1}`}
                      onChange={(e)=>handleInputArrayChange(e.target.name, index, e.target.value)}
                      disabled={!isEditing}
                    />
                    <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveArrayItems('whatYouLearn',index)}
                    className="h-8 w-8 text-destructive"
                    disabled={!isEditing}
                >
                  <X className="h-4 w-4" 
                   />
                </Button>
                  </div>
                ))}
                <p className={`${formErrors?.whatYouLearn ? 'text-red-500' : 'text-blue-500' } text-sm font-semibold opacity-80`}>
                  {formErrors ? formErrors.whatYouLearn : 'Required Field'} 
                </p>
              <br/>
            <Button type="button" variant="outline" size="sm" 
            onClick={() => handleInputAddItemsToArray('whatYouLearn')}
             className="mt-2"
             disabled={!isEditing}
             >
            <Plus className="mr-2 h-3 w-3" />
            Add Description
          </Button>

              </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("category", value)}
                    defaultValue={course?.category}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category,index)=>(
                        <SelectItem key={index} value={category._id} >{category.name}</SelectItem>
                      ))}
                    
                    </SelectContent>
                  </Select>
                  <p className={`${formErrors?.category ? 'text-red-500' : 'text-blue-500' } text-sm font-semibold opacity-80`}>
                  {formErrors ? formErrors.category : 'Required Field'} 
                </p>
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("level", value)}
                    defaultValue={course?.level}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>

                 <div className="w-1/2  mt-4" >
                  <Label>Thumbnail</Label>
                  <ImageUpload 
                  onChange={handleImageChange}
                   onRemove={handleImageChange}
                    value={course.thumbnail}
                    disabled={!isEditing} />
                    <p className={`${formErrors?.thumbnail ? 'text-red-500' : 'text-blue-500' } text-sm font-semibold opacity-80`}>
                  {formErrors ? formErrors.thumbnail : 'Required Field'} 
                </p>
                 </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
            <CardTitle className="flex justify-between items-center">
                Course Content
                {!isEditing && (
                  <Button onClick={handleEdit}>
                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                  </Button>
                )}
                
              </CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-blue-500 text-sm font-semibold opacity-80">
            NB : At least one module is required, and each module must have at least one lesson.
                </p>
              <Accordion type="single" collapsible className="w-full">
                {course?.modules.map((module, moduleIndex) => (
                  <AccordionItem value={`module-${moduleIndex}`} key={moduleIndex}>
                    <AccordionTrigger>
                      {isEditing ? (
                     
                        <Input
                          value={module.title || ''}
                          placeholder = 'Enter Module Title'
                          onChange={(e) => {
                            e.stopPropagation();
                            // console.log(e.target.value)
                            handleModuleChange(moduleIndex, "title", e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
               
                        
                      ) : (
                        <div className="flex items-center justify-between w-full pr-4">
                          <span>{module.title}</span>
                          <Badge variant="outline" className="ml-2">
                            {module.lessons.length} {module.lessons.length === 1 ? "lesson" : "lessons"}
                          </Badge>
                        </div>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      {module?.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="mb-4 p-4 border rounded-lg bg-muted/30">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Lesson {lessonIndex + 1}</h4>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {lesson.duration} min
                            </Badge>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <Label>Lesson Title</Label>
                              <Input
                                value={lesson.title}
                                placeholder = 'Enter Lesson Title'
                                onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, "title", e.target.value)}
                                disabled={!isEditing}
                              />
                               
                            </div>

                          <div className="w-1/2">
                            <Label>Video URL</Label>
                            <VideoUpload 
                            value={lesson.videoUrl}
                            onChange={(videoUrl)=> handleLessonChange(moduleIndex, lessonIndex, "videoUrl", videoUrl)}
                            onRemove={()=> handleLessonChange(moduleIndex, lessonIndex, "videoUrl", "")}
                            disabled={!isEditing ? true : false}
                            />
                            <p className="text-blue-500 text-sm font-semibold opacity-80">
                          Required
                            </p>
                          </div>

                          <div>
                            <Label>Attachments</Label>
                            <FileUpload
                             value={lesson.attachments || []}
                              onChange={(urls)=> handleLessonChange(moduleIndex, lessonIndex, 'attachments' , urls)}
                              disabled={!isEditing ? true : false}
                            />
                          </div>
                          <div>
                        <Label htmlFor="duration">Duration ( In minutes )</Label>
                        <Input
                          id="duration"
                          name="duration"
                          type="number"
                          value={lesson.duration}
                          onChange={(e)=>handleLessonChange(moduleIndex, lessonIndex, 'duration', Number(e.target.value))}
                          disabled={!isEditing}
                        />
                         <p className="text-blue-500 text-sm font-semibold opacity-80">
                          Required
                            </p>
                    </div>
                          </div>
                        </div>
                      ))}
                      {isEditing && (
                        <Button onClick={() => handleAddLesson(moduleIndex)} variant="outline" className="mt-2">
                          <Plus className="mr-2 h-4 w-4" /> Add Lesson
                        </Button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {isEditing && (
                <Button onClick={handleAddModule} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Add Module
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
            <CardTitle className="flex justify-between items-center">
                Pricing
                {!isEditing && (
                  <Button onClick={handleEdit}>
                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFree"
                    checked={course?.isFree}
                    onCheckedChange={() => handleSwitchChange("isFree")}
                    disabled={!isEditing}
                  />
                  <Label htmlFor="isFree">Free Course</Label>
                </div>
                {!course?.isFree && (
                  <>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={course.price}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                      <p className="text-blue-500 text-sm font-semibold opacity-80">
                          Required
                            </p>
                    </div>
                    <div>
                      <Label htmlFor="discount">Discount (%)</Label>
                      <Input
                        id="discount"
                        name="discount"
                        type="number"
                        value={course?.discount}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2 mt-4 md:mt-6 lg:mt-8">
                <Label>Requirements</Label>
                {course?.requirements.map((field,index) => (
                 <div key={index} className="flex items-center gap-2">
                    <Input type = 'text'
                      name= 'requirements'
                      value = {field}
                      placeholder = {`Requirement ${index + 1}`}
                      onChange={(e)=>handleInputArrayChange(e.target.name, index, e.target.value)}
                      disabled={!isEditing}
                    />
                    <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveArrayItems('requirements',index)}
                    className="h-8 w-8 text-destructive"
                    disabled={!isEditing}
                >
                  <X className="h-4 w-4" 
                   />
                </Button>
                  </div>
                ))}

            <Button type="button" variant="outline" size="sm" 
            onClick={() => handleInputAddItemsToArray('requirements')}
             className="mt-2"
             disabled={!isEditing}
             >
            <Plus className="mr-2 h-3 w-3" />
            Add Requirement
          </Button>

              </div>

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Reviews</span>
                {course?.reviews?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${star <= Math.round(course.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="font-bold">{course.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({course.reviews.length} reviews)</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {course?.reviews?.length > 0 ? (
                <div className="space-y-4">
                  {course?.reviews?.map((review, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {review.userId?.charAt(0) || "U"}
                            </div>
                            <span className="font-medium">Student</span>
                          </div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-2">{review.comment || "No comment provided."}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {review.createdAt ? format(new Date(review.createdAt), "MMMM dd, yyyy") : "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Reviews</AlertTitle>
                  <AlertDescription>This course hasn't received any reviews yet.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="delete">
          <DeleteCourseCard courseTitle={course.title} onDelete={handleDeleteCourse} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CourseDetails

