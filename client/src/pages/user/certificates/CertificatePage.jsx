import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Grid3X3, List, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"

import { useLoadCertificatesQuery } from '@/services/userApi/userCourseApi.js'

import CertificateGrid from "./components/Certificate-grid"
import CertificateList from "./components/Certificate-list"
import CertificateModal from "./components/Certificate-modal"
import EmptyCertificates from "./components/Empty-certificates"
import CertificateSkeleton from "./components/Certificate-skeleton"

const CertificatePage = () => {
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCertificate, setSelectedCertificate] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
//   const { certificates, recentCertificates, isLoading, error } = useCertificates()

  const { data : details, isLoading, error } = useLoadCertificatesQuery({ searchQuery, page : currentPage })

  const data = details?.data
  const certificates = data?.certificates
  console.log(data)

  const handleOpenCertificate = (certificate) => {
    setSelectedCertificate(certificate)
    setIsModalOpen(true)
  }

  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0 },
  }

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-7xl"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Your Certificates
          </h1>
          <p className="text-muted-foreground mt-1">View and manage all your course completion certificates</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="transition-all duration-300"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            className="transition-all duration-300"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search certificates by course title, tutor name, or level"
            className="pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

        <div className="mt-0">
          {isLoading ? (
            <CertificateSkeleton viewMode={viewMode} count={6} />
          ) : error ? (
            <div className="text-center py-12 text-red-500">Error loading certificates. Please try again later.</div>
          ) : certificates?.length === 0 && searchQuery ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No certificates match your search criteria.</p>
              <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          ) : certificates?.length === 0 ? (
            <EmptyCertificates />
          ) : viewMode === "grid" ? (
            <CertificateGrid certificates={certificates || []} onOpenCertificate={handleOpenCertificate} />
          ) : (
            <CertificateList certificates={certificates || []} onOpenCertificate={handleOpenCertificate} />
          )}
        </div>

      <AnimatePresence>
        {isModalOpen && selectedCertificate && (
          <CertificateModal
            certificate={selectedCertificate}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>

    {/* Pagination */}
      {!isLoading && certificates?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex items-center justify-center gap-2 flex-wrap"
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 p-0 border-gray-200"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {Array.from({ length: data?.totalPages || 1 }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                className={`rounded-full w-10 h-10 p-0 ${
                  currentPage === page
                    ? "bg-gradient-to-r from-primary to-purple-600 text-white border-none"
                    : "border-gray-200"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 p-0 border-gray-200"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= (data?.totalPages || 1)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        )}

    </motion.div>

  )
}

export default CertificatePage
