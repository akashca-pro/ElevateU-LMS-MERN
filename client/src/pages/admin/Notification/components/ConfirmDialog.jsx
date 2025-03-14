import { useState } from "react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { toast } from "sonner";

export default function ConfirmDialog({ 
  btnName, btnClass, id, action, refetchData, description='' ,title = ''}) {
  const [reason, setReason] = useState("");

  const handleAction = async (id, reason) => {
    const toastId = toast.loading("Please wait . . .");
    try {
      const input = btnName.toLowerCase();
      const response = await action({ input, id, reason }).unwrap();
      toast.success(response?.message || "Verification done", { id: toastId });
      refetchData();
      setReason('');
    } catch (error) {
      console.log(error)
      toast.error(error?.data?.message || "Error verifying", { id: toastId });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className={btnClass}>{btnName}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title ? title : "Are you absolutely sure?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {description ? description : "This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <label className="text-sm font-medium">Reason</label>
          <Input
            type="text"
            placeholder="Enter reason if any"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel >Cancel</AlertDialogCancel>
          <AlertDialogAction className={btnClass} onClick={() => handleAction(id, reason)} >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}