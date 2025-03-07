import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ProfileDialog({ onSave, title, btnName, desc ,notValid}) {
  const [open, setOpen] = useState(false); // State for opening/closing the dialog

  const handleSave = () => {
    if (onSave) {
      onSave(() => setOpen(false)); // Pass setOpen function so it can be used in ProfileDetails
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button  disabled={notValid} 
        onClick={() => setOpen(true)}>Update Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleSave}>{btnName}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}