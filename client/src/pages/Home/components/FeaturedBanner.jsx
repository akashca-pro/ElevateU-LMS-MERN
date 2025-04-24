import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBestSellingCoursesQuery } from "@/services/commonApi.js"
import { formatCurrency } from "@/pages/admin/Dashboard/utli.js"
import { motion } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookX } from "lucide-react"
import { container, cardVariant } from "./CategoriesBanner"
import { useNavigate } from "react-router-dom"

const FeaturedBanner = () => {
  const navigate = useNavigate()
  const { data: courses } = useBestSellingCoursesQuery()

  const renderCard = ({ item, index }) => {
    return <ProductCard item={item} index={index} />
  }

  return (
    <>
    { courses?.data && courses?.data?.length > 0 &&  <div className="bg-gradient-to-b from-[#1E1B4B] to-[#312E81] py-24 relative overflow-hidden">

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-white mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Featured Courses
          </motion.h2>

          <motion.p
            className="text-gray-300 text-lg max-w-3xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover our top-performing courses loved by thousands of learners! These best sellers are handpicked based
            on popularity, student satisfaction, and proven success. Start learning from the best today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button
              onClick={() => navigate("/explore")}
              className="mt-8 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Browse All Courses
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Best selling courses */}
        <Card className="border-none rounded-2xl shadow-2xl bg-white/5 backdrop-blur-sm">
          <CardContent className="space-y-8 py-10 px-6">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative"
            >
              <Carousel className="w-full overflow-visible">
                <CarouselContent className="-ml-4 md:-ml-6">
                  {courses?.data?.map((item, index) => (
                    <CarouselItem key={item._id} className="pl-4 md:pl-6 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <motion.div
                        onClick={() => {
                          navigate(`/explore/courses/${item._id}`)
                        }}
                        variants={cardVariant}
                        className="h-full cursor-pointer"
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {renderCard({ item, index })}
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {(courses?.data?.length === 0 || !courses?.data) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center p-12 text-center text-gray-300"
                  >
                    <BookX className="w-16 h-16 mb-4 text-gray-400" />
                    <h2 className="text-xl font-semibold">No courses found</h2>
                    <p className="text-sm mt-2">Try adjusting your filters or date range.</p>
                  </motion.div>
                )}                

                <div className="flex justify-center gap-4 mt-8">
                  <CarouselPrevious className="static transform-none h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border-none text-white" />
                  <CarouselNext className="static transform-none h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border-none text-white" />
                </div>
              </Carousel>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>}</>
  )
}

function ProductCard({ item, index }) {
  return (
    <Card className="overflow-hidden h-full border-none shadow-lg hover:shadow-xl transition-all duration-500 rounded-xl bg-white">
      <div className="aspect-[4/3] w-full relative overflow-hidden rounded-t-xl">
        {item.thumbnail ? (
          <img
            src={item.thumbnail || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none shadow-md">
          #{index + 1}
        </Badge>
      </div>

      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg line-clamp-1">{item.title}</h3>
          {item.isFree !== undefined &&
            (item.isFree ? (
              <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-none">Free</Badge>
            ) : (
              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {item.price !== undefined ? formatCurrency(item.price) : ""}
              </span>
            ))}
        </div>

        {item.level && (
          <Badge variant="outline" className="mt-1 text-xs bg-gray-50 border-gray-200 text-gray-700">
            {item.level}
          </Badge>
        )}

        {item.description && <p className="text-sm text-gray-500 mt-3 line-clamp-2">{item.description}</p>}

        {item.tutorName && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
            {item.tutorImage ? (
              <div className="h-8 w-8 rounded-full overflow-hidden relative shadow-sm">
                <img
                  src={item.tutorImage || "/placeholder.svg"}
                  alt={item.tutorName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-600 flex items-center justify-center text-xs font-medium shadow-sm">
                {item.tutorName.charAt(0)}
              </div>
            )}
            <span className="text-sm font-medium">{item.tutorName}</span>
          </div>
        )}

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Total Students</span>
          <Badge className="bg-purple-100 text-purple-700 border-none font-medium">
            {item.totalSales.toLocaleString()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default FeaturedBanner
