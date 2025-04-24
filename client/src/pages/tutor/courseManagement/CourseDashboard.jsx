import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, BarChart3, ChevronLeft, ChevronRight, Search} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import {useNavigate } from "react-router-dom";
import {useTutorLoadCoursesQuery } from '@/services/TutorApi/tutorCourseApi';
import { useLoadCategoriesQuery } from '@/services/commonApi';
import {CreateCourseButton} from './CreateCourse/Course-create-button.jsx';
import { FilterBox } from "@/components/FilterBox";
import LoadingSpinner from "@/components/FallbackUI/LoadingSpinner";
import ErrorComponent from "@/components/FallbackUI/ErrorComponent";
import { Badge } from "@/components/ui/badge.jsx";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export default function CourseDashboard() {
  const { data : details } = useLoadCategoriesQuery();
  const categoryData = details?.data;
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredQuery, setFilteredQuery] = useState('latest');
  const limit = 7;

  const {data : courses, isLoading, error, refetch, status} = useTutorLoadCoursesQuery({
    page : currentPage,
    search : searchQuery,
    limit,
    filter : filteredQuery
  });  
  const data = courses?.data;

  if(isLoading) return (<LoadingSpinner/>);
  if(status === 500) return (<ErrorComponent onRetry={()=>window.location.reload()}/>);

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-blue-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return 'Active';
      case 'pending': return 'Awaiting approval';
      case 'rejected': return 'Request rejected';
      default: return 'Draft';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">Course Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage and monitor your educational offerings</p>
        </motion.div>

        <Card className="w-full backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-xl overflow-hidden">
          {/* Search and Filter Section */}
          <div className="p-6 border-b border-gray-100">
            <motion.div 
              className="flex flex-col md:flex-row justify-between items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative w-full md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name and description"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white/60 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                <CreateCourseButton />
                <FilterBox 
                  onSelect={setFilteredQuery}
                  options={[
                    { value: "latest", label: "Latest" },
                    { value: "oldest", label: "Oldest" },
                    { value: "Not-Active", label: "Not-Active" },
                    { value: "Draft", label: "Draft" },
                  ]}
                />
              </div>
            </motion.div>
          </div>

          <CardContent className="p-6">
            {/* Course Grid */}
            {!(data?.courses?.length > 0) ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="bg-gray-50 rounded-full p-6 mb-4">
                  <BarChart3 className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-xl font-medium text-gray-600">No courses found</p>
                <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {data?.courses.map((course) => (
                  <motion.div
                    key={course._id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card className="h-full overflow-hidden border-0 bg-white rounded-xl transition-all duration-300 shadow-md hover:shadow-xl">
                      <div className="relative w-full h-48 overflow-hidden">
                        <img 
                          src={course?.thumbnail || 'https://via.placeholder.com/400x200?text=Course+Thumbnail'} 
                          alt={course.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)} text-white`}>
                            {getStatusText(course.status)}
                          </Badge>
                        </div>

                        {/* Action Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-700 rounded-full h-8 w-8 p-1.5 shadow-md">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 bg-white shadow-lg rounded-lg border-0">
                            <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer">
                              <BarChart3 size={16} />
                              <span>View Analytics</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="p-5 space-y-3">
                        <div>
                          <h3 
                            onClick={() => navigate(`/tutor/profile/course-management/${course._id}`)}
                            className="text-lg font-semibold text-gray-800 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                          >
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {categoryData?.find(cat => cat._id === course.category)?.name || "Uncategorized"}
                          </p>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-gray-700">{course.totalEnrollment}</span>
                            <span className="text-xs text-gray-500">Students</span>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs rounded-lg border-gray-200 hover:bg-gray-50"
                            onClick={() => navigate(`/tutor/profile/course-management/${course._id}`)}
                          >
                            Manage
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {data?.courses.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="mt-10 flex items-center justify-center"
              >
                <div className="inline-flex items-center rounded-lg bg-white shadow-sm border border-gray-100 p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-md text-gray-500 hover:text-gray-800"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  <div className="hidden sm:flex">
                    {Array.from({ length: data?.totalPages || 1 }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "ghost"}
                        size="sm"
                        className={`rounded-md mx-0.5 min-w-[2.5rem] ${
                          currentPage === page 
                            ? "bg-primary text-white" 
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page.toString().padStart(2, "0")}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="sm:hidden px-3 py-1.5 text-sm font-medium">
                    Page {currentPage} of {data?.totalPages || 1}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-md text-gray-500 hover:text-gray-800"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage >= (data?.totalPages || 1)}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
