import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Clock, ChevronRight } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useLoadCategoriesQuery, useLoadTopRatedCoursesQuery, useLoadNewReleasesCoursesQuery, useLoadBestSellersCoursesQuery,
    useLoadTrendingCoursesQuery
 } from '@/services/commonApi.js'
import { useNavigate } from "react-router-dom"
import LoadingSpinner from "@/components/FallbackUI/LoadingSpinner"
import ErrorComponent from "@/components/FallbackUI/ErrorComponent"


const ExplorePage = () => {
    const navigate = useNavigate()
    const { data : details } = useLoadCategoriesQuery()
    const { data : trendingData, isLoading : trendingDataLoading, error : trendingDataError } = useLoadTrendingCoursesQuery()
    const { data : topRatedData, isLoading : topRatedDataLoading, error : topRatedDataError } = useLoadTopRatedCoursesQuery()
    const { data : bestSellingData, isLoading : bestSellingDataLoading, error : bestSellingDataError } = useLoadBestSellersCoursesQuery()
    const { data : newReleasesData, isLoading : newReleasesDataLoading, error : newReleasesDataError } = useLoadNewReleasesCoursesQuery()
    const categories = details?.data

    console.log(topRatedData?.data)

  const courseSections = [
      { title: "Trending Now", courses: trendingData?.data || [] },
      { title: "Top Rated", courses: topRatedData?.data || [] },
      { title: "Best Sellers", courses: bestSellingData?.data || [] },
      { title: "New Releases", courses: newReleasesData?.data || [] },
  ]

  if(trendingDataLoading || topRatedDataLoading || bestSellingDataLoading || newReleasesDataLoading)
    return (<LoadingSpinner/>)
 
  if(trendingDataError || topRatedDataError || bestSellingDataError || newReleasesDataError)return(<ErrorComponent/>)

  const CategoryCard = ({ category }) => (
    <Card
    onClick={()=>navigate(`/explore/categories/${category.name}`,{state : category?._id})}
     className="h-full">
      <CardContent className="p-0">
        <img
          src={category.icon || "/placeholder.svg?height=150&width=250&text=Category"}
          alt={category.name}
          className="w-full h-32 object-cover rounded-t-lg"
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <h3 className="font-semibold text-lg">{category.name}</h3>
        {/* <p>{category.description}</p> */}
      </CardFooter>
    </Card>
  )

  const CourseCard = ({ course }) => (
    <Card 
    onClick={()=>navigate(`/explore/courses/${course?.title}`,{state : course?._id})}
    className="h-full" >
      <CardContent className="p-0">
        <img
          src={course?.thumbnail || "/placeholder.svg"}
          alt={course?.title}
          className="w-full h-40 object-cover rounded-t-lg"
        />
      </CardContent>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2">{course?.title}</h3>
        <p className="text-sm text-muted-foreground">{course?.tutor?.firstName}</p>
        <div className="flex items-center mt-2">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
          <span className="font-medium mr-1">{course?.rating}</span>
          <span className="text-muted-foreground text-sm">({course?.totalEnrollment} students)</span>
        </div>
        <div className="flex items-center mt-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{course?.duration} hours</span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Courses</h1>

      {/* Categories Carousel */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {categories?.map((category) => (
              <CarouselItem key={category.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
                <CategoryCard category={category} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Course Sections */}
      {courseSections
      .filter(section=>section?.courses.length > 0)
      .map((section, index) => (
        <section key={index} className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            <Button variant="ghost" className="text-primary">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {section.courses?.map((course) => (
                <CarouselItem key={course._id} className="pl-2 md:pl-4 md:basis-1/3">
                  <CourseCard course={course} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      ))}
    </div>
  )
}

export default ExplorePage

