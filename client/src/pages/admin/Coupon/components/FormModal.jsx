import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { couponSchema } from "@/Validations/couponSchema"

import { Dialog, DialogTrigger, DialogContent, DialogHeader,
     DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { PlusCircle } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { useAdminCreateCouponMutation } from '@/services/adminApi/adminCouponApi.js'
import { Switch } from "@/components/ui/switch"


const FormModal = ()=>{
    const [isOpen, setIsOpen] = useState(false)
    const [confirmClose,setConfirmClose] = useState(false)
    const [createCoupon] = useAdminCreateCouponMutation()
    
    const form = useForm({
        resolver : zodResolver(couponSchema),
        defaultValues : {
            code : "",
            discountType : '',
            discountValue : 0,
            minPurchaseAmount : 0,
            maxDiscount : 0,
            expiryDate : "",
            usageLimit : 1,
            isActive : false
        }
    })

    const handleSubmit = async (data) => {
        const toastId = toast.loading('Please wait...')
        try {
            console.log(data)
            await createCoupon({ formData : data }).unwrap()

            toast.success('Coupon created',{
                description : `${data.code} is created`,
                id : toastId
            })
            setIsOpen(false)
            form.reset()
        } catch (error) {
            console.log(error)
            if (error?.status === 400 && Array.isArray(error?.data?.errors)) {
                const errorMessages = error.data.errors.map((err) => `• ${err.msg}`).join("\n");
        
              toast.error("Validation Errors", {
                  id : toastId,
                  description: errorMessages, 
                  duration: 6000,
                  important: true,
                  style: { 
                    fontSize: "14px",  
                    whiteSpace: "pre-line",  
                    padding: "18px",  
                    maxWidth: "500px" 
                }
              });
            } else {
                toast.error(error?.data?.message, { id: toastId });
            }
        }
        
    }

    useEffect(()=>{
        if(!isOpen){
            form.reset()
        }
    },[isOpen, form])

    const handleClose = () => {
        if (form.formState.isDirty) {
            setConfirmClose(true) 
        } else {
            setIsOpen(false) 
        }
    }

    const confirmDiscard = () => {
        setConfirmClose(false)
        setIsOpen(false) 
        form.reset() 
    }

    return (
        <>
       <Dialog open={isOpen} onOpenChange={(open)=>open ? setIsOpen(true) : handleClose()} >
        <DialogTrigger asChild>
        <Button
         onClick={()=>setIsOpen(true)}
        >
        Add Coupon <PlusCircle/>
        </Button>
        </DialogTrigger>

        <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Coupon</DialogTitle>
          <DialogDescription>Enter the coupon details below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

           

            {/* Coupon code */}
            <FormField 
            control = {form.control}
            name='code'
            render={({ field }) => (
                <FormItem className='flex-1'>
                    <FormLabel>Coupon Code</FormLabel>
                    <FormControl>
                    <Input {...field} 
                    onChange={(e)=>field.onChange(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code" />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
            />

            <div className="flex gap-3">

            {/* Discount type */}

            <FormField 
            control = {form.control}
            name='discountType'
            render={({ field })=>(
                <FormItem className='flex-1'>
                    <FormLabel>Discount Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select discount type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage/>
                </FormItem>
            )}
            />

            {/* Discount value */}

            <FormField 
            control={form.control}
            name='discountValue'
            render={({ field })=>(
                <FormItem>
                    <FormLabel>Discount Value</FormLabel>
                    <FormControl>
                        <Input 
                        {...field}
                        type='number'
                        onChange={(e)=>field.onChange(Number(e.target.value))}
                        placeholder={'Enter the value'}
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
            />

          
            </div>

            <div className="flex gap-3 items-center">
  {/* Expiry date */}
  <FormField
    control={form.control}
    name="expiryDate"
    render={({ field }) => (
      <FormItem className="flex-1">
        <FormLabel>Expiry Date</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl className="flex-1">
              <Button variant="outline" className="w-full text-left">
                {field.value ? format(new Date(field.value), "PPP") : "Select a date"}
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent align="start">
            <Calendar
              mode="single"
              selected={field.value ? new Date(field.value) : null}
              onSelect={(date) => field.onChange(date?.toISOString())}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    )}
  />

  {/* Coupon Status */}
  <FormField
    control={form.control}
    name="isActive"
    render={({ field }) => (
      <FormItem className="flex items-center gap-2">
        <FormLabel></FormLabel>
        <FormControl>
          <Switch checked={field.value} onCheckedChange={field.onChange} />
        </FormControl>
        <FormLabel>Active</FormLabel>
      </FormItem>
    )}
  />
</div>

            <div className="flex gap-3">


            {/* minPurchaseAmount */}

            <FormField
            control = {form.control}
            name='minPurchaseAmount'
            render={({ field })=>(
                <FormItem className='flex-1'>
                    <FormLabel>Minimum Purchase Amount</FormLabel>
                    <FormControl>
                    <Input
                    {...field}
                    type='number'
                    onChange={(e)=>field.onChange(Number(e.target.value))}
                    />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
            />

            {/* Max Discount */}

            <FormField
            control={form.control}
            name='maxDiscount'
            render={({field})=>(
                <FormItem className='flex-1'>
                    <FormLabel>Max Discount Allowed</FormLabel>
                    <FormControl>
                        <Input
                        {...field}
                        type='number'
                        onChange={(e)=>field.onChange(Number(e.target.value))}
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
            />

            </div>

            {/* Usage limit */}

            <FormField
            control={form.control}
            name='usageLimit'
            render={({ field })=>(
                <FormItem>
                    <FormLabel>Usage Limit</FormLabel>
                    <FormControl>
                        <Input
                        {...field}
                        type='number'
                        onChange={(e)=>field.onChange(Number(e.target.value))}
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
            />
        
        <div className="flex justify-end gap-2">
            
            <Button
            type='submit'
            >
            Create Coupon
            </Button>

        </div>

        
        </form>
        </Form>

        </DialogContent>
       </Dialog>

        {/* Confirmation Dialog */}

        <Dialog open={confirmClose} onOpenChange={setConfirmClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Discard Changes?</DialogTitle>
                        <DialogDescription>You have unsaved changes. Are you sure you want to close the form?</DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setConfirmClose(false)}>Cancel</Button>
                        <Button onClick={confirmDiscard}>Discard</Button>
                    </div>
                </DialogContent>
            </Dialog>
       </>
    )
}

export default FormModal