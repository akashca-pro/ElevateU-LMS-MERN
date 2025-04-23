import { motion } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookX } from "lucide-react"
import { useBestSellingCategoriesQuery } from "@/services/commonApi.js"
import { useNavigate } from "react-router-dom"

export const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

export const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
}

const CategoriesBanner = () => {
  const { data: categories } = useBestSellingCategoriesQuery()

  const renderCard = ({ item, index }) => {
    return <CategoryCard item={item} index={index} />
  }

  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50">
      <Card className="rounded-xl border-none shadow-lg max-w-7xl mx-auto bg-white/80 backdrop-blur-sm">
        <CardContent className="space-y-8 py-10 px-6">
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.h2
                className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Popular Categories
              </motion.h2>
              <motion.div
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 w-full rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </motion.div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative"
          >
            <Carousel className="w-full overflow-visible">
              <CarouselContent className="-ml-4 md:-ml-6">
                {categories?.data?.map((item, index) => (
                  <CarouselItem key={item._id} className="pl-4 md:pl-6 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <motion.div
                      variants={cardVariant}
                      className="h-full"
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderCard({ item, index })}
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {(categories?.data?.length === 0 || !categories?.data) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center p-12 text-center text-gray-500"
                >
                  <BookX className="w-16 h-16 mb-4 text-gray-400" />
                  <h2 className="text-xl font-semibold">No categories found</h2>
                  <p className="text-sm mt-2">Try adjusting your filters or date range.</p>
                </motion.div>
              )}

              {/* Gradient edges for visual effect */}
         
              <div className="flex justify-center gap-4 mt-8">
                <CarouselPrevious className="static transform-none h-10 w-10 rounded-full bg-white shadow-md hover:bg-gray-50 border-none" />
                <CarouselNext className="static transform-none h-10 w-10 rounded-full bg-white shadow-md hover:bg-gray-50 border-none" />
              </div>
            </Carousel>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}

function CategoryCard({ item, index }) {
  const navigate = useNavigate()
  return (
    <Card className="overflow-hidden h-full border-none shadow-lg hover:shadow-xl transition-all duration-500 rounded-xl">
      <div
        onClick={() => navigate("/explore", { state: item._id })}
        className="aspect-[16/9] w-full relative overflow-hidden rounded-t-xl cursor-pointer"
      >
        {item.thumbnail ? (
          <img
            src={item.thumbnail || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-500/20 to-blue-500/10 flex items-center justify-center">
            <span className="text-primary font-medium">{item.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
          <div className="p-6 text-white w-full">
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none shadow-md">
              #{index + 1}
            </Badge>
            <motion.h3
              className="font-bold text-xl mb-1"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              viewport={{ once: true }}
            >
              {item.title}
            </motion.h3>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CategoriesBanner
