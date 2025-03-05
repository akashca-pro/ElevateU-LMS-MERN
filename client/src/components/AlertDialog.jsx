import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { toast } from "sonner"
  
  export function AlertDialogDelete({btnName, btnClass ,id, deleteApi,onSuccess}) {
    const [deleteData] = deleteApi()
    const handleDelete = async(id) =>{
        const toastId = toast.loading('Please wait . . .')
        try {
            const response = await deleteData(id).unwrap()
            toast.success(response?.message || 'Data deleted successfully',{id : toastId});
            onSuccess()
        } catch (error) {
            toast.error(error?.data?.message || 'Error deleting data, try again later',{id : toastId})
        }
    }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className={btnClass}>{btnName}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the data
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className={'bg-red-700 hover:bg-red-800'} onClick={()=>handleDelete(id)} >Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  