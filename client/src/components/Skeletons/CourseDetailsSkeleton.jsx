import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const CourseDetailsSkeleton = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
        <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-12">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-2/3" />
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-28 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn Skeleton */}
            <Card>
              <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Course Content Skeleton */}
            <Card>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-5 w-36" />
                </div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <div className="pl-8 space-y-2">
                      {[...Array(2)].map((_, j) => (
                        <Skeleton key={j} className="h-10 w-full rounded-lg" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Instructor Skeleton */}
            <Card>
              <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="space-y-4 flex-1 w-full">
                    <Skeleton className="h-6 w-48" />
                    <div className="flex flex-wrap gap-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-5 w-32" />
                      ))}
                    </div>
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Reviews Skeleton */}
            <Card>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-6 w-36" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-2 flex-1" />
                        <Skeleton className="h-5 w-10" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <Skeleton className="h-6 w-36 mt-2" />
                  </div>
                </div>
                <Separator />
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="space-y-4 py-6">
                    <div className="flex justify-between">
                      <div className="flex gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div>
                          <Skeleton className="h-5 w-24 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Enrollment Card Skeleton */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-6 space-y-6">
                <div className="flex justify-between">
                  <Skeleton className="h-10 w-32" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-14 flex-grow" />
                  <Skeleton className="h-14 w-14" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center">
                        <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}