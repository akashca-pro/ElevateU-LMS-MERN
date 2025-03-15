import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useNavigate } from "react-router-dom"



const Categories = ({ categories }) => {
    const navigate = useNavigate()

    const CategoryCard = ({ category }) => (
        <Card
        onClick={()=>navigate(`/explore/categories/${category.name}`,{state : category?._id})}
         className="h-full">
          <CardContent className="p-0">
            <img
              src={category.icon || "/placeholder.svg?height=150&width=250&text=Category"}
              alt={category.name}
              className="w-full h-32 object-cover rounded-t-lg"
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start p-4">
            <h3 className="font-semibold text-lg">{category.name}</h3>
            {/* <p>{category.description}</p> */}
          </CardFooter>
        </Card>
      )

      return (
        <>
    
          {/* Categories Carousel */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Categories</h2>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {categories?.map((category,index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
                    <CategoryCard category={category} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
    
          </>       
      )
}

export default Categories
