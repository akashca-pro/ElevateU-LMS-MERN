import { useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"

/**
 * @param {Object} props
 * @param {import('react-hook-form').UseFormReturn} props.form
 * @param {() => void} props.nextStep
 * @param {() => void} props.prevStep
 */
export function StepPricing({ form, nextStep, prevStep }) {
  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control: form.control,
    name: "requirements",
  })

  const isFree = form.watch("isFree")

  const handleNext = () => {
    form.trigger(["price", "isFree", "discount", "level", "requirements"]).then((isValid) => {
      if (isValid) {
        nextStep()
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Pricing & Requirements</h2>
        <p className="text-sm text-muted-foreground">Set your course pricing and requirements.</p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="isFree"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Free Course</FormLabel>
                <FormDescription>Make this course available for free</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                    if (checked) {
                      form.setValue("price", 0)
                      form.setValue("discount", 0)
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {!isFree && (
          <>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Set the price for your course in USD</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter discount percentage"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Set a discount percentage (0-100)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Select the difficulty level of your course</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Requirements</FormLabel>
          <FormDescription>List any prerequisites or requirements for taking this course</FormDescription>

          <div className="space-y-2">
            {requirementFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`requirements.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder={`Requirement ${index + 1}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRequirement(index)}
                  className="h-8 w-8 text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" size="sm" onClick={() => appendRequirement("")} className="mt-2">
            <Plus className="mr-2 h-3 w-3" />
            Add Requirement
          </Button>
        </div>
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

