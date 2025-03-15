import { useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Upload, X } from "lucide-react"
import { FileUpload } from "../FileUpload"
import { VideoUpload } from "../VideoUpload"

export function StepContent({ form, nextStep, prevStep }) {
  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({
    control: form.control,
    name: "modules",
  })

  const handleNext = () => {
    form.trigger("modules").then((isValid) => {
      if (isValid) {
        nextStep()
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Course Content</h2>
        <p className="text-sm text-muted-foreground">Add modules and lessons to your course.</p>
      </div>

      <div className="space-y-4">
        {moduleFields.map((moduleField, moduleIndex) => (
          <Card key={moduleField.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Module {moduleIndex + 1}</CardTitle>
                {moduleFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeModule(moduleIndex)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name={`modules.${moduleIndex}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter module title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Lessons</h4>
                </div>

                <ModuleLessons form={form} moduleIndex={moduleIndex} />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => appendModule({ title: "", lessons: [{ title: "", videoUrl: "", attachments: [] }] })}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Module
        </Button>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep}>
          Previous Step
        </Button>
        <Button type="button" onClick={handleNext}>
          Next Step
        </Button>
      </div>
    </div>
  )
}


function ModuleLessons({ form, moduleIndex }) {
  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control: form.control,
    name: `modules.${moduleIndex}.lessons`,
  })

  return (
    <div className="space-y-3">
      {lessonFields.map((lessonField, lessonIndex) => (
        <Card key={lessonField.id} className="border-dashed">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium">Lesson {lessonIndex + 1}</h5>
              {lessonFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLesson(lessonIndex)}
                  className="h-6 w-6 text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <FormField
              control={form.control}
              name={`modules.${moduleIndex}.lessons.${lessonIndex}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter lesson title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`modules.${moduleIndex}.lessons.${lessonIndex}.videoUrl`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <div className="flex gap-2"> 
                     <VideoUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange("")} />
                    </div>
                  </FormControl>
                  <FormDescription>Upload a new video</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`modules.${moduleIndex}.lessons.${lessonIndex}.attachments`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachments</FormLabel>
                  <FormControl>
                    <FileUpload value={field.value || []} onChange={(urls) => field.onChange(urls)} multiple />
                  </FormControl>
                  <FormDescription>Add supplementary materials for this lesson</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

          <FormField
              control={form.control}
              name={`modules.${moduleIndex}.lessons.${lessonIndex}.duration`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Lesson Duration"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Set the duration in minutes</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => appendLesson({ title: "", videoUrl: "", attachments: [] })}
        className="w-full"
      >
        <Plus className="mr-2 h-3 w-3" />
        Add Lesson
      </Button>
    </div>
  )
}

