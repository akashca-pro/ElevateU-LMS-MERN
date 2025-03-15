import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  Star,
  Clock,
  Award,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  User,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLoadCoursesQuery } from "@/services/commonApi";
import { useNavigate } from "react-router-dom";

const CoursesListing = () => {
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 9,
    filter: {
      search: "",
      tutors: [],
      rating: 0,
      levels: [],
      priceRange: [0, 10000],
      duration: [0, 500],
      hasCertification: false,
    },
  });


  // Fetch courses using RTK Query
  const { data: allCourses, isLoading, isError , refetch} = useLoadCoursesQuery(queryParams);


  const coursesData = allCourses?.data

  console.log(queryParams)
  console.log(coursesData)

  // State for mobile filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // Handle filter changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setQueryParams((prev) => ({ ...prev, page: 1 })); // Reset to page 1 when filters change
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [queryParams.filter]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setQueryParams((prev) => ({
      ...prev,
      filter: { ...prev.filter, [filterName]: value },
      page: 1, // Reset to page 1 when filters change
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setQueryParams((prev) => ({
      ...prev,
      filter: {
        search: "",
        tutors: [],
        rating: 0,
        levels: [],
        priceRange: [0, 10000],
        duration: [0, 500],
        hasCertification: false,
      },
      page: 1,
    }));
    refetch()
  };

  // Toggle level selection
  const toggleLevel = (level) => {
    setQueryParams((prev) => {
      const newLevels = prev.filter.levels.includes(level)
        ? prev.filter.levels.filter((l) => l !== level)
        : [...prev.filter.levels, level];

      return {
        ...prev,
        filter: { ...prev.filter, levels: newLevels },
      };
    });
  };

  // Toggle tutor selection
  const toggleTutor = (tutorId) => {
    setQueryParams((prev) => {
      const newTutors = prev.filter.tutors.includes(tutorId)
        ? prev.filter.tutors.filter((id) => id !== tutorId) // Remove tutor if already selected
        : [...prev.filter.tutors, tutorId]; // Add tutor if not selected
  
      return {
        ...prev,
        filter: { ...prev.filter, tutors: newTutors },
      };
    });
  };

  // Extract unique tutors from the fetched courses
const uniqueTutors = coursesData?.courses
?.map((course) => course.tutor) // Get all tutors
?.filter((tutor, index, self) => self.findIndex((t) => t._id === tutor._id) === index); // Remove duplicates

  // Handle pagination
  const handlePageChange = (newPage) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(Number.parseFloat(rating))
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-gray-600 mb-8">Discover the perfect course to enhance your skills</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            className="w-full flex justify-between items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </span>
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Filters Sidebar */}
        <div className={`lg:w-1/4 ${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="bg-white rounded-lg shadow-sm border p-5 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 text-xs text-blue-600 hover:text-blue-800"
              >
                <X className="mr-1 h-3 w-3" />
                Clear all
              </Button>
            </div>

            <div className="space-y-5">
              {/* Search Filter */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search courses..."
                    className="pl-9"
                    value={queryParams.filter.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Price Range Filter */}
              <div>
                <label className="text-sm font-medium mb-3 block">Price Range</label>
                <div className="px-1">
                  <Slider
                    defaultValue={[0, 10000]}
                    min={0}
                    max={10000}
                    step={10}
                    value={queryParams.filter.priceRange}
                    onValueChange={(value) => handleFilterChange("priceRange", value)}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>${queryParams.filter.priceRange[0]}</span>
                    <span>${queryParams.filter.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium mb-3 block">Minimum Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={queryParams.filter.rating >= rating ? "default" : "outline"}
                      size="sm"
                      className={`h-8 w-8 p-0 ${
                        queryParams.filter.rating >= rating
                          ? "bg-yellow-400 hover:bg-yellow-500 text-white border-yellow-400"
                          : "text-gray-500"
                      }`}
                      onClick={() => handleFilterChange("rating", rating)}
                    >
                      {rating}
                    </Button>
                  ))}
                  {queryParams.filter.rating > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => handleFilterChange("rating", 0)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              <Separator />

              {/* Level Filter */}
              <div>
                <label className="text-sm font-medium mb-3 block">Level</label>
                <div className="space-y-2">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <div key={level} className="flex items-center">
                      <Checkbox
                        id={`level-${level}`}
                        checked={queryParams.filter.levels.includes(level)}
                        onCheckedChange={() => toggleLevel(level)}
                      />
                      <label
                        htmlFor={`level-${level}`}
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Duration Filter */}
              <div>
                <label className="text-sm font-medium mb-3 block">Duration (hours)</label>
                <div className="px-1">
                  <Slider
                    defaultValue={[0, 50]}
                    min={0}
                    max={50}
                    step={1}
                    value={queryParams.filter.duration}
                    onValueChange={(value) => handleFilterChange("duration", value)}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{queryParams.filter.duration[0]}h</span>
                    <span>{queryParams.filter.duration[1]}h</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Certification Filter */}
              <div>
                <div className="flex items-center">
                  <Checkbox
                    id="certification"
                    checked={queryParams.filter.hasCertification}
                    onCheckedChange={(checked) =>
                      handleFilterChange("hasCertification", checked)
                    }
                  />
                  <label htmlFor="certification" className="ml-2 text-sm font-medium leading-none">
                    Includes Certification
                  </label>
                </div>
              </div>

              <Separator />

              {/* Tutors Filter */}
              <Accordion type="single" collapsible className="w-full">
  <AccordionItem value="tutors">
    <AccordionTrigger className="text-sm font-medium py-1">Tutors</AccordionTrigger>
    <AccordionContent>
      <div className="space-y-2 mt-1">
        {uniqueTutors?.map((tutor) => (
          <div key={tutor._id} className="flex items-center">
            <Checkbox
              checked={queryParams.filter.tutors.includes(tutor._id)}
              id={`${tutor._id}`}
              onCheckedChange={() => toggleTutor(tutor._id)}
            />
            <label
              htmlFor={`tutor-${tutor._id}`}
              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {tutor.firstName} {tutor.lastName}
            </label>
          </div>
        ))}
      </div>
    </AccordionContent>
  </AccordionItem>
</Accordion>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Sorting and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <p className="text-gray-600">
              Showing <span className="font-medium">{coursesData?.total || 0}</span> results
            </p>

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm whitespace-nowrap">
                Sort by:
              </label>
              <Select
                value={queryParams.sort}
                onValueChange={(value) =>
                  setQueryParams((prev) => ({ ...prev, sort: value }))
                }
              >
                <SelectTrigger className="w-[180px]" id="sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="rating-high-low">Rating: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Course Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading...</p>
            </div>
          ) : isError ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Error loading courses</h3>
              <p className="text-gray-500">Please try again later</p>
            </div>
          ) : coursesData?.courses?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesData.courses.map((course) => (
                <CourseCard key={course._id} course={course} renderStars={renderStars} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No courses found</h3>
              <p className="text-gray-500">Try adjusting your filters or search criteria</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {coursesData?.totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, queryParams.page - 1))}
                      className={queryParams.page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, coursesData.totalPages) }, (_, i) => {
                    let pageNum;
                    if (coursesData.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (queryParams.page <= 3) {
                      pageNum = i + 1;
                    } else if (queryParams.page >= coursesData.totalPages - 2) {
                      pageNum = coursesData.totalPages - 4 + i;
                    } else {
                      pageNum = queryParams.page - 2 + i;
                    }

                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={pageNum === queryParams.page}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {coursesData.totalPages > 5 && queryParams.page < coursesData.totalPages - 2 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(coursesData.totalPages)}>
                          {coursesData.totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(coursesData.totalPages, queryParams.page + 1))}
                      className={queryParams.page === coursesData.totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course, renderStars }) => {
  const navigate = useNavigate();
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md">
      <div className="relative">
        <img
          src={course.thumbnail || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-40 object-cover"
        />
        {course.hasCertification && (
          <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
            <Award className="mr-1 h-3 w-3" />
            Certificate
          </Badge>
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg line-clamp-1" title={course.title}>
          {course.title}
        </CardTitle>
        <div className="flex items-center mt-1">
          <User className="h-3 w-3 text-gray-400 mr-1" />
          <span className="text-sm text-gray-600">{course.tutor?.firstName} {course.tutor?.lastName}</span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-grow">
      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{course.description}</p>

      <div className="flex justify-between items-center mb-2">
        {renderStars(course.rating)}
        <Badge variant="outline" className="text-xs font-normal">
        {course.level}
        </Badge>
      </div>

      <div className="flex items-center text-sm text-gray-600">
      <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
      <span>{course.duration} hours</span>
    </div>
    </CardContent>

    <CardFooter className="p-4 pt-0 mt-auto flex justify-between items-center">
    <span className="font-bold text-lg">
     {course.price === 0 ? "Free" : `$${course.price}`}
    </span>
    <Button
    onClick = {()=>navigate(`/explore/courses/${course.title}`,{state : course._id})}
    >View Course</Button>
    </CardFooter>
    </Card>
    );
    };

export default CoursesListing;