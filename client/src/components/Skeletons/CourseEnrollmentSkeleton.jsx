import { Skeleton } from "@/components/ui/skeleton"

export const CourseEnrollmentSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="rounded-xl border p-4 space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-4 sticky top-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
          </div>
        </div>
      </div>
    </div>
  )
}