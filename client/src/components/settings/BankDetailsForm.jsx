import {  useEffect } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import bankSchema from "@/Validations/bankSchema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useAddBankAccountMutation,useLoadBankDetailsQuery } from '@/services/TutorApi/tutorWalletApi.js'


export default function BankDetailsForm({ isEdit, setIsEdit }) {
  const { data, refetch } = useLoadBankDetailsQuery();
  const [addBankDetails,{isLoading}] = useAddBankAccountMutation() 

  const bankDetails = data?.data

  const form = useForm({
    resolver: zodResolver(bankSchema),
    defaultValues : {
      accountNumber: '',
      ifsc: '',
      bankName: '',
      holderName: '',
    },
  })

  useEffect(() => {
    if (bankDetails) {
      const updatedValues = {
        accountNumber: bankDetails?.accountNumber || '',
        ifsc: bankDetails?.ifsc || '',
        bankName: bankDetails?.bankName || '',
        holderName: bankDetails?.holderName || '',
      }
      form.reset(updatedValues)
    }
  }, [bankDetails])

  async function onSubmit(values) {
      const toastId = toast.loading('Please wait. . . ',{
        description : 'Updating Bank Details'
      })
      try {
        await addBankDetails({ formData : values }).unwrap();
        refetch()
        setIsEdit(true);
        toast.success('Data updated Successfully',{id : toastId , 
          description : 'Bank Details updated ' });
      } catch (error) {
        console.log(error);
        toast.error('Error updating data',{id : toastId,
          description : 'Update Bank details failed'
        })
      }
  }

  const handleCancel = () => {
    setIsEdit(true)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                  <Input
                    disabled={isEdit}
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter account number"
                    {...field}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, "")
                      field.onChange(digitsOnly)
                    }}
                  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ifsc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IFSC Code</FormLabel>
                  <FormControl>
                    <Input disabled={isEdit} placeholder="Enter IFSC code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input disabled={isEdit} placeholder="Enter bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="holderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Holder Name</FormLabel>
                  <FormControl>
                    <Input disabled={isEdit} placeholder="Enter account holder name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="text-xs text-muted-foreground mt-2">
            <p>Note: Your bank details are securely stored and used only for payment processing.</p>
          </div>

          <div className="flex gap-2">
          <Button type="submit" disabled={isLoading || isEdit} className="w-full sm:w-auto">
            Save Bank Details
          </Button>
          { !isEdit && <Button disabled={isLoading} onClick={handleCancel} className="w-full sm:w-auto" >
            Cancel
          </Button>}
          </div>
        </form>
      </Form>
    </motion.div>
  )
}

