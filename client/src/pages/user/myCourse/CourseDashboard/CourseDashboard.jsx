import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabsContent } from '@radix-ui/react-tabs'
import React from 'react'
import Enrolled from './tabs/Enrolled'
import Bookmark from './tabs/Bookmark'
import { useSearchParams } from 'react-router-dom'

const CourseDashboard = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'enrolled'
  return (
    <div className="container mx-auto p-6 max-w-full overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center gap-4 w-full">
        <h1 className="text-2xl font-bold">My Courses</h1>

    </div>
    

      <div className="flex justify-end gap-2 w-full md:w-auto">
      </div>
    </div>
    <div>

      <Tabs defaultValue={defaultTab} className="" >
        <TabsList className='grid  grid-cols-2'>
          <TabsTrigger value='enrolled' >Enrolled</TabsTrigger>
          <TabsTrigger value='bookmark' >Bookmark</TabsTrigger>
        </TabsList>

        <TabsContent value='enrolled' >
        <Enrolled/> 
        </TabsContent>

        <TabsContent value='bookmark' >
          <Bookmark/>
        </TabsContent>

      </Tabs>
    </div>
    </div>
  )
}

export default CourseDashboard
