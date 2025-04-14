import { motion } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
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
  <Card className="rounded-none">
      <CardContent className="space-y-4 py-6">
          <div className="flex justify-center">
      <motion.h2
        className="text-2xl font-bold text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Popular Categories
      </motion.h2>
    </div>

        <motion.div variants={container} initial="hidden" animate="show">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {categories?.data?.map((item, index) => (
                <CarouselItem
                  key={item._id}
                  className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <motion.div variants={cardVariant} className="h-full">
                    {renderCard({ item, index })}
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {(categories?.data?.length === 0 || !categories?.data) && (
              <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
                <BookX className="w-12 h-12 mb-4 text-gray-400" />
                <h2 className="text-lg font-semibold">No categories found</h2>
                <p className="text-sm">Try adjusting your filters or date range.</p>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <CarouselPrevious className="static transform-none" />
              <CarouselNext className="static transform-none" />
            </div>
          </Carousel>
        </motion.div>
      </CardContent>
    </Card>
  )
}

function CategoryCard({ item, index }) {
  const navigate = useNavigate()
  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div
      onClick={()=>navigate('/explore',{ state : item._id })} 
      className="aspect-[16/9] w-full relative overflow-hidden">
        {item.thumbnail ? (
          <img
            src={item.thumbnail || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium">{item.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-4 text-white w-full">
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
              #{index + 1}
            </Badge>
            <h3 className="font-bold text-lg mb-1">{item.title}</h3>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CategoriesBanner