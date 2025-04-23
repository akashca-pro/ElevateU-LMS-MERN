import { Skeleton } from "@/components/ui/skeleton"

export const CourseListingSkeleton = () => {
  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl min-h-screen">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
        <Skeleton className="h-10 w-[500px] mx-auto" />
        <Skeleton className="h-6 w-[700px] mx-auto" />
        <Skeleton className="h-4 w-[400px] mx-auto" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar Skeleton */}
        <div className="lg:w-1/4 space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sticky top-4">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>

            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-px w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:w-3/4">
          {/* Sorting and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-48" />
          </div>

          {/* Course Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                {/* Image */}
                <Skeleton className="w-full h-48" />
                
                <div className="p-5 space-y-4">
                  {/* Title & Tutor */}
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>

                  {/* Rating & Level */}
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>

                  {/* Duration */}
                  <Skeleton className="h-4 w-32" />

                  {/* Price & Button */}
                  <div className="flex justify-between items-center pt-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="mt-12">
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-10" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}