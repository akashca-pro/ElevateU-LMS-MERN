import React from 'react'
import { ArrowRight } from "lucide-react"
import { Button } from '@/components/ui/button'
import { useBestSellingCoursesQuery } from '@/services/commonApi.js'
import { formatCurrency } from "@/pages/admin/Dashboard/utli.js"
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
import { container, cardVariant } from './CategoriesBanner'
import { useNavigate } from 'react-router-dom'

const FeaturedBanner = () =>{

  const navigate = useNavigate()
const { data : courses } = useBestSellingCoursesQuery()

const renderCard = ({ item, index }) => {
  return <ProductCard item={item} index={index} />
}

    return (
      <div className="bg-[#1E1B4B] py-20">
        <div className="container mx-auto px-4">
          <div className="text-white mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Courses</h2>
            <p className="text-gray-300">
            Discover our top-performing courses loved by thousands of learners! These best sellers are handpicked based on popularity, student satisfaction, and proven success. Start learning from the best today.
            </p>
            <Button
            onClick={()=>navigate('/explore')}
            className='my-4'
            >
              Browse All Courses
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
  
          
          {/* Best selling courses */}

          <Card >
            <CardContent className="space-y-4 py-6">
                <div className="flex justify-center">
          </div>

              <motion.div variants={container} initial="hidden" animate="show">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {courses?.data?.map((item, index) => (
                      <CarouselItem
                        key={item._id}
                        className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                      >
                        <motion.div
                        onClick={() => {
                          navigate(`/explore/courses/${item._id}`)
                        }}
                         variants={cardVariant} className="h-full">
                          {renderCard({ item, index })}
                        </motion.div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {(courses?.data?.length === 0 || !courses?.data) && (
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


        </div>
      </div>
    )
  }

function ProductCard({ item, index }) {
  return (
    <Card className="border border-border overflow-hidden h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="aspect-[4/3] w-full relative overflow-hidden bg-muted">
        {item.thumbnail ? (
          <img       
          src={item.thumbnail || "/placeholder.svg"}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">#{index + 1}</Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-base line-clamp-1">{item.title}</h3>
          {item.isFree !== undefined &&
            (item.isFree ? (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Free
              </Badge>
            ) : (
              <span className="font-bold text-sm">{item.price !== undefined ? formatCurrency(item.price) : ""}</span>
            ))}
        </div>

        {item.level && (
          <Badge variant="outline" className="mt-1 text-xs">
            {item.level}
          </Badge>
        )}

        {item.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>}

        {item.tutorName && (
          <div className="flex items-center gap-2 mt-3">
            {item.tutorImage ? (
              <div className="h-6 w-6 rounded-full overflow-hidden relative">
               <img
              src={item.tutorImage || "/placeholder.svg"}
              alt={item.tutorName}
              className="w-full h-full object-cover"
            />
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                {item.tutorName.charAt(0)}
              </div>
            )}
            <span className="text-xs">{item.tutorName}</span>
          </div>
        )}

        <div className="flex justify-between items-center mt-3 pt-3 border-t text-sm">
          <span className="text-muted-foreground text-xs">Total Students</span>
          <Badge variant="outline" className="font-medium">
            {item.totalSales.toLocaleString()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default FeaturedBanner
