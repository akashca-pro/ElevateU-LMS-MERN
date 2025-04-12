import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "./utli.js"
import CoursesFilter from "./components/CoursesFilter.jsx"
import { BookX } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const cardVariant = {
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

export default function TopSellersCarousel({
  onApplyFilter,
  title,
  items,
  type,
  autoScroll = true,
  autoScrollInterval = 5000,
}) {
  const [api, setApi] = useState()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  // Setup auto scroll
  useEffect(() => {
    if (!api || !autoScroll) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, autoScrollInterval)

    return () => clearInterval(interval)
  }, [api, autoScroll, autoScrollInterval])

  // Update current slide
  useEffect(() => {
    if (!api) return

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1)
    }

    api.on("select", handleSelect)
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

  // Render card based on type
  const renderCard = ({item, index}) => {
    switch (type) {
      case "product":
        return <ProductCard item={item} index={index} />
      case "category":
        return <CategoryCard item={item} current={current} />
      case "brand":
        return <BrandCard item={item} current={current} />
      default:
        return <ProductCard item={item} index={index} />
    }
  }

  return (
    <div className="space-y-4 py-6">
      <div className="flex items-center justify-between">
        <motion.h2
          className="text-2xl font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        <motion.div
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {current} / {count}
        </motion.div>
      </div>

     <CoursesFilter onApplyFilter={onApplyFilter} />

      <motion.div variants={container} initial="hidden" animate="show">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {items?.map((item, index) => (
              <CarouselItem key={item._id} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <motion.div variants={cardVariant} className="h-full">
                  {renderCard({item, index})}
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          { (items?.length === 0 || !items) && <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
          <BookX className="w-12 h-12 mb-4 text-gray-400" />
          <h2 className="text-lg font-semibold">No courses found</h2>
          <p className="text-sm">Try adjusting your filters or date range.</p>
        </div>}
          <div className="flex justify-end gap-2 mt-4">
            <CarouselPrevious className="static transform-none" />
            <CarouselNext className="static transform-none" />
          </div>
        </Carousel>
      </motion.div>
    </div>
  )
}

// Sub-components for different item types
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
        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">#{ index + 1}</Badge>
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
          <span className="text-muted-foreground text-xs">Sales</span>
          <Badge variant="secondary" className="font-medium">
            {item.totalSales.toLocaleString()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function CategoryCard({ item, current }) {
  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="aspect-[16/9] w-full relative overflow-hidden">
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
            <Badge className="mb-2 bg-primary text-primary-foreground">#{current + 1}</Badge>
            <h3 className="font-bold text-lg mb-1">{item.title}</h3>
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-sm">Total Sales</span>
              <Badge className="bg-white/20 text-white">{item.totalSales.toLocaleString()}</Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function BrandCard({ item, current }) {
  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col">
      <div className="aspect-square w-full relative overflow-hidden p-6 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {item.thumbnail ? (
          <img
          src={item.thumbnail || "/placeholder.svg"}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-xl">{item.title.charAt(0)}</span>
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">#{current + 1}</Badge>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-center mb-2">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-2">{item.description}</p>
        )}
        <div className="mt-auto pt-3 border-t flex justify-between items-center">
          <span className="text-muted-foreground text-xs">Total Sales</span>
          <Badge variant="secondary" className="font-medium">
            {item.totalSales.toLocaleString()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
