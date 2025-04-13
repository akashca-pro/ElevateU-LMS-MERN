import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "../ImageUpload"
import { useLoadCategoriesQuery } from '@/services/commonApi'
import { useTutorCheckTitleCourseQuery } from '@/services/TutorApi/tutorCourseApi'
import { useEffect, useState } from "react"
import { useFieldArray } from "react-hook-form"
import { Plus, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export function StepBasicDetails({ form, nextStep ,setCategoryName, titleError , setTitleError}) {

  const {  
    fields : whatYouLearnField,
    append : appendWhatYouLearn,
    remove : removeWhatYouLearn
  } = useFieldArray({
    control: form.control,
    name: "whatYouLearn",
  })

  const { data : details } = useLoadCategoriesQuery()
  const categories = details?.data;

  const title = form.watch('title');

  const encodedTitle = title ? encodeURIComponent(title) : '';

  const { error: titleCheck } = useTutorCheckTitleCourseQuery(
    encodedTitle,
    { skip: !title || title.trim().length < 1 } 
  );

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
      if (isValid && !titleError) {
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
            <Select
            onValueChange={(value) => {
            field.onChange(value); 
            setCategoryName(categories.find(category => category._id === value)?.name || ""); 
             }}
             defaultValue={field.value}
              >
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
          name="hasCertification"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Enable Certificate
                </FormLabel>
                <FormDescription>
                  Not sure yet? No worries — you can toggle this anytime in your course settings.
                </FormDescription>
              </div>
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

    <div className="space-y-2">
          <FormLabel>What you'll learn (description)</FormLabel>
          <FormDescription>List the things can be learned from this course</FormDescription>

          <div className="space-y-2">
            {whatYouLearnField.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`whatYouLearn.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder={`Goal ${index + 1}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeWhatYouLearn(index)}
                  className="h-8 w-8 text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" size="sm" onClick={() => appendWhatYouLearn("")} className="mt-2">
            <Plus className="mr-2 h-3 w-3" />
            Add Goal
          </Button>
        </div>

      <div className="flex justify-end">
        <Button type="button" onClick={handleNext}>
          Next Step
        </Button>
      </div>
    </div>
  )
}

