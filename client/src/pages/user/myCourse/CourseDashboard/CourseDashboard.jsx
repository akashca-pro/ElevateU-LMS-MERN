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
    <div className="container max-w-7xl py-10 mx-auto">

      <Tabs defaultValue={defaultTab}  >
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
  )
}

export default CourseDashboard
