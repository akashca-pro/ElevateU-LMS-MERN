import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "../ImageUpload"
import { useLoadCategoriesQuery } from '@/services/commonApi'
import { useTutorCheckTitleCourseQuery } from '@/services/TutorApi/tutorCourseApi'
import { useEffect, useState } from "react"


/**
 * @param {Object} props
 * @param {import('react-hook-form').UseFormReturn} props.form
 * @param {() => void} props.nextStep
 */
export function StepBasicDetails({ form, nextStep }) {
  const { data : details } = useLoadCategoriesQuery()
  const categories = details?.data;

  const title = form.watch('title');

  const { error : titleCheck , isFetching} = useTutorCheckTitleCourseQuery(
    title?.length > 2 ? title : '',
    {skip : !title || title.length < 3}
  )

  const [titleError,setTitleError] = useState('')

  useEffect(()=>{
      if(titleCheck?.status === 409){
        setTitleError("Course title already exists. Choose another.");
      }
      else{
        setTitleError('')
      }
  },[titleCheck])

  const handleNext = () => {
    form.trigger(["title", "description", "category", "thumbnail"]).then((isValid) => {
      if (isValid) {
        nextStep()
      }
    })
  }


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Basic Details</h2>
        <p className="text-sm text-muted-foreground">Provide the basic information about your course.</p>
      </div>

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter course title" {...field} />
            </FormControl>
            <FormDescription>A clear and concise title for your course.</FormDescription>
            <FormMessage>{titleError}</FormMessage>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter course description" className="min-h-[120px]" {...field} />
            </FormControl>
            <FormDescription>Describe what students will learn in this course.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category?._id} value={category?._id}>
                    {category?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Choose the category that best fits your course.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="thumbnail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Thumbnail</FormLabel>
            <FormControl>
              <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange("")} />
            </FormControl>
            <FormDescription>Upload a thumbnail image for your course (16:9 ratio recommended).</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-end">
        <Button type="button" onClick={handleNext}>
          Next Step
        </Button>
      </div>
    </div>
  )
}

