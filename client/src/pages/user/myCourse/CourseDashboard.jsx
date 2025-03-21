import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabsContent } from '@radix-ui/react-tabs'
import { Search } from 'lucide-react'
import React from 'react'
import Enrolled from './tabs/Enrolled'
import Finished from './tabs/Finished'
import Bookmark from './tabs/Bookmark'
import Ongoing from './tabs/Ongoing'

const CourseDashboard = () => {
  return (
    <div className="container mx-auto p-6 max-w-full overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center gap-4 w-full">
        <h1 className="text-2xl font-bold">My Courses</h1>

    </div>
    

      <div className="flex justify-end gap-2 w-full md:w-auto">
        {/* <FilterBox onSelect={setFilteredQuery} selectValue={'Draft'}/> */}
      </div>
    </div>
    <div>

      <Tabs defaultValue="details" className="" >
        <TabsList>
          <TabsTrigger value='ongoing' >Ongoing </TabsTrigger>
          <TabsTrigger value='finished' >Finished </TabsTrigger>
          <TabsTrigger value='enrolled' >Enrolled</TabsTrigger>
          <TabsTrigger value='bookmark' >Bookmark</TabsTrigger>
        </TabsList>

        <TabsContent value='ongoing' >
          <Ongoing/>
        </TabsContent>

        <TabsContent value='finished' >
          <Finished/>
        </TabsContent>

        <TabsContent value='bookmark' >
          <Bookmark/>
        </TabsContent>

        <TabsContent value='enrolled'>
        <Enrolled/>
        </TabsContent>

      </Tabs>
    </div>
    </div>
  )
}

export default CourseDashboard
