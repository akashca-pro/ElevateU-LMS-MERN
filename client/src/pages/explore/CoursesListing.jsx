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
  SelectGroup,
  SelectItem,
  SelectLabel,
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
  Sparkles,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLoadCoursesQuery } from "@/services/commonApi";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CoursesListing = ({ categories }) => {
  const location = useLocation();

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 9,
    filter: {
      sort: "newest",
      search: "",
      category: location?.state ? location?.state : "",
      tutors: [],
      rating: 0,
      levels: [],
      priceRange: [0, 10000],
      duration: [0, 10000],
      hasCertification: false,
    },
  });

  // Fetch courses using RTK Query
  const {
    data: allCourses,
    isLoading,
    isError,
    refetch,
  } = useLoadCoursesQuery(queryParams);

  const coursesData = allCourses?.data;

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
        category: "",
        tutors: [],
        rating: 0,
        levels: [],
        priceRange: [0, 10000],
        duration: [0, 10000],
        hasCertification: false,
        sort: "newest",
      },
      page: 1,
    }));
    refetch();
  };

  // select category
  const handleSelect = (value) => {
    setQueryParams((prev) => {
      return {
        ...prev,
        filter: { ...prev.filter, category: value },
      };
    });
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
    ?.filter(
      (tutor, index, self) =>
        self.findIndex((t) => t._id === tutor._id) === index
    ); // Remove duplicates

  // Handle pagination
  const handlePageChange = (newPage) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  // Animation properties for course cards
  const courseCardVariants = (index) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
      },
    },
  });

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
          Discover Your Next Learning Journey
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Explore a diverse range of courses tailored to different skill levels and career paths. Whether you're a beginner, intermediate, or advanced learner, we've got the right course for you!
        </p>
        <p className="text-gray-500 text-base">
          Refine your search with advanced filters to find the perfect course for you.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4 animate-fade-in">
          <Button
            variant="outline"
            className="w-full flex justify-between items-center bg-white shadow-sm border-gray-200 hover:bg-gray-50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </span>
            {showFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Filters Sidebar */}
        <div
          className={`lg:w-1/4 transition-all duration-300 ease-in-out ${
            showFilters 
              ? "max-h-[5000px] opacity-100" 
              : "max-h-0 lg:max-h-[5000px] opacity-0 lg:opacity-100 overflow-hidden lg:overflow-visible"
          }`}
        >
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sticky top-4 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                <X className="mr-1 h-3 w-3" />
                Clear all
              </Button>
            </div>

            <div className="space-y-6">
              {/* Search Filter */}
              <div className="group">
                <label className="text-sm font-medium mb-2 block text-gray-700 group-hover:text-gray-900 transition-colors">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search courses..."
                    className="pl-10 border-gray-200 bg-gray-50 focus:bg-white transition-all"
                    value={queryParams.filter.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                  />
                </div>
              </div>

              <Separator className="bg-gray-100" />

              {/* category based filter */}
              <div className="group">
                <label className="text-sm font-medium mb-2 block text-gray-700 group-hover:text-gray-900 transition-colors">
                  Categories
                </label>
                <Select
                  value={queryParams.filter.category}
                  onValueChange={handleSelect}
                >
                  <SelectTrigger className="border-gray-200 bg-gray-50 focus:bg-white transition-all">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Available Categories</SelectLabel>
                      {categories.map((category, index) => (
                        <SelectItem key={index} value={category?._id}>
                          {category?.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-gray-100" />

              {/* Price Range Filter */}
              <div className="group">
                <label className="text-sm font-medium mb-3 block text-gray-700 group-hover:text-gray-900 transition-colors">
                  Price Range
                </label>
                <div className="px-1">
                  <Slider
                    defaultValue={[0, 10000]}
                    min={0}
                    max={10000}
                    step={10}
                    value={queryParams.filter.priceRange}
                    onValueChange={(value) =>
                      handleFilterChange("priceRange", value)
                    }
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>₹{queryParams.filter.priceRange[0]}</span>
                    <span>₹{queryParams.filter.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-100" />

              {/* Rating Filter */}
              <div className="group">
                <label className="text-sm font-medium mb-3 block text-gray-700 group-hover:text-gray-900 transition-colors">
                  Minimum Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={
                        queryParams.filter.rating >= rating
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className={`h-8 w-8 p-0 ${
                        queryParams.filter.rating >= rating
                          ? "bg-yellow-400 hover:bg-yellow-500 text-white border-yellow-400"
                          : "text-gray-500 border-gray-200"
                      } transition-all`}
                      onClick={() => handleFilterChange("rating", rating)}
                    >
                      {rating}
                    </Button>
                  ))}
                  {queryParams.filter.rating > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs hover:bg-yellow-50"
                      onClick={() => handleFilterChange("rating", 0)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              <Separator className="bg-gray-100" />

              {/* Level Filter */}
              <div className="group">
                <label className="text-sm font-medium mb-3 block text-gray-700 group-hover:text-gray-900 transition-colors">
                  Level
                </label>
                <div className="space-y-3">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <div
                      key={level}
                      className="flex items-center hover:bg-gray-50 p-1.5 rounded-md -ml-1.5 transition-colors"
                    >
                      <Checkbox
                        id={`level-${level}`}
                        checked={queryParams.filter.levels.includes(level)}
                        onCheckedChange={() => toggleLevel(level)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
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

              <Separator className="bg-gray-100" />

              {/* Duration Filter */}
              <div className="group">
                <label className="text-sm font-medium mb-3 block text-gray-700 group-hover:text-gray-900 transition-colors">
                  Duration (Minutes)
                </label>
                <div className="px-1">
                  <Slider
                    defaultValue={[0, 50]}
                    min={0}
                    max={10000}
                    step={1}
                    value={queryParams.filter.duration}
                    onValueChange={(value) =>
                      handleFilterChange("duration", value)
                    }
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{queryParams.filter.duration[0]}m</span>
                    <span>{queryParams.filter.duration[1]}m</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-100" />

              {/* Certification Filter */}
              <div className="group">
                <div className="flex items-center hover:bg-gray-50 p-1.5 rounded-md -ml-1.5 transition-colors">
                  <Checkbox
                    id="certification"
                    checked={queryParams.filter.hasCertification}
                    onCheckedChange={(checked) =>
                      handleFilterChange("hasCertification", checked)
                    }
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <label
                    htmlFor="certification"
                    className="ml-2 text-sm font-medium leading-none flex items-center gap-1"
                  >
                    Includes Certification
                    <Award className="h-3.5 w-3.5 text-green-500" />
                  </label>
                </div>
              </div>

              <Separator className="bg-gray-100" />

              {/* Tutors Filter */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tutors" className="border-none">
                  <AccordionTrigger className="text-sm font-medium py-1 text-gray-700 hover:text-gray-900 hover:no-underline">
                    Tutors
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 mt-1 max-h-40 overflow-y-auto pr-1">
                      {uniqueTutors?.map((tutor) => (
                        <div
                          key={tutor._id}
                          className="flex items-center hover:bg-gray-50 p-1.5 rounded-md -ml-1.5 transition-colors"
                        >
                          <Checkbox
                            checked={queryParams.filter.tutors.includes(
                              tutor._id
                            )}
                            id={`tutor-${tutor._id}`}
                            onCheckedChange={() => toggleTutor(tutor._id)}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <label
                            htmlFor={`tutor-${tutor._id}`}
                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
                          >
                            <User className="h-3 w-3 text-gray-400" />
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
        <div className="lg:w-3/4 animate-fade-in">
          {/* Sorting and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <p className="text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              Showing{" "}
              <span className="font-medium text-gray-900">
                {coursesData?.total || 0}
              </span>{" "}
              results
            </p>

            <div className="flex items-center gap-2">
              <Select
                value={queryParams.filter.sort}
                onValueChange={(value) =>
                  setQueryParams((prev) => ({
                    ...prev,
                    filter: { ...prev.filter, sort: value },
                  }))
                }
              >
                <SelectTrigger className="w-[180px] bg-white border-gray-200 shadow-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-high-low">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="price-low-high">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="rating-high-low">
                    Rating: High to Low
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Course Grid */}
          { isError ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-md border border-red-100 animate-fade-in">
              <BookOpen className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Error loading courses
              </h3>
              <p className="text-gray-500 mb-4">Please try again later</p>
              <Button onClick={() => refetch()} className="bg-red-500 hover:bg-red-600">Try Again</Button>
            </div>
          ) : coursesData?.courses?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesData.courses.map((course, index) => (
              <motion.div
                key={course._id}
                variants={courseCardVariants(index)}
                initial="hidden"
                animate="visible"
                viewport={{ once: true }}
              >
                <CourseCard
                  course={course}
                  renderStars={renderStars}
                />
              </motion.div>
            ))}
          </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-100 animate-fade-in">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No courses found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button
                variant="outline"
                className="mt-2 border-gray-200 hover:bg-gray-50"
                onClick={clearFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Clear all filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {coursesData?.totalPages > 1 && (
            <div className="mt-12 animate-fade-in">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, queryParams.page - 1))
                      }
                      className={`${
                        queryParams.page === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      } transition-all hover:scale-105`}
                    />
                  </PaginationItem>

                  {Array.from(
                    { length: Math.min(5, coursesData.totalPages) },
                    (_, i) => {
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
                            className="transition-transform hover:scale-110"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}

                  {coursesData.totalPages > 5 &&
                    queryParams.page < coursesData.totalPages - 2 && (
                      <>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() =>
                              handlePageChange(coursesData.totalPages)
                            }
                            className="transition-transform hover:scale-110"
                          >
                            {coursesData.totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(
                          Math.min(coursesData.totalPages, queryParams.page + 1)
                        )
                      }
                      className={`${
                        queryParams.page === coursesData.totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      } transition-all hover:scale-105`}
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
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] group bg-white border border-gray-100">
      <div className="relative overflow-hidden">
        <img
          src={course.thumbnail || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {course.hasCertification && (
          <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 shadow-sm">
            <Award className="mr-1 h-3 w-3" />
            Certificate
          </Badge>
        )}
        {course.price === 0 && (
          <Badge className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600 shadow-sm">
            Free
          </Badge>
        )}
      </div>

      <CardHeader className="p-5 pb-2">
        <CardTitle className="text-lg line-clamp-1 group-hover:text-blue-600 transition-colors" title={course.title}>
          {course.title}
        </CardTitle>
        <div className="flex items-center mt-1">
          <User className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
          <span className="text-sm text-gray-600">
            {course.tutor?.firstName} {course.tutor?.lastName}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 flex-grow">
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
          {course.description}
        </p>

        <div className="flex justify-between items-center mb-3">
          {renderStars(course.rating)}
          <Badge
            variant="outline"
            className={`text-xs font-normal border ${
              course.level === "Beginner"
                ? "border-green-200 bg-green-50 text-green-700"
                : course.level === "Intermediate"
                ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {course.level}
          </Badge>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
          <span>{course.duration} minutes</span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto flex justify-between items-center border-t border-gray-100">
        <span className="font-bold text-lg">
          {course.price === 0 ? (
            <span className="text-blue-600 flex items-center">
              <Sparkles className="h-4 w-4 mr-1" /> Free
            </span>
          ) : (
            <span className="text-gray-900">₹{course.price}</span>
          )}
        </span>
        <Button
          onClick={() => navigate(`/explore/courses/${course._id}`)}
          className="bg-blue-600 hover:bg-blue-700 transition-all shadow-sm"
        >
          View Course
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CoursesListing;