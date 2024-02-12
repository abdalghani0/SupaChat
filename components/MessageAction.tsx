"use client"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"  
import { Button } from "@/components/ui/button"
import { Imessage, useMessage } from "@/lib/store/messages"
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { useRef } from "react"
  
  export function DeleteAlert() {
    const actionMessage = useMessage((state) => state.actionMessage);
    const optimisticDeleteMessage = useMessage((state) => state.optimisticDeleteMessage )

    const handleDeleteMessage = async() => {
        const supabase = supabaseBrowser();
        optimisticDeleteMessage(actionMessage?.id!);
        const {error} = await supabase.from("messages").delete().eq("id", actionMessage?.id!);
        if(error) {
            toast.error(error.message);
        }
        else {
            toast.success("Successfully deleted the message");
        }
    }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button id="trigger-delete"></button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              message and remove it data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMessage}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  
  export function EditAlert() {
    const actionMessage = useMessage((state) => state.actionMessage);
    const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const optimisticUpdateMessage = useMessage((state) => state.optimisticUpdateMessage);
    const handleEditMessage = async() => {
        const supabase = supabaseBrowser();
        const text = inputRef.current.value.trim();
        if(text){
            optimisticUpdateMessage({
              ...actionMessage,
              text,
              is_edit: true,
            } as Imessage)
            const {error} = await supabase.from("messages").update({text, is_edit:true}).eq("id", actionMessage?.id!);
            if(error) {
                toast.error(error.message)
            }
            else {
                toast.message("Successfully updated message")
            }
            document.getElementById("trigger-edit")?.click();
        }
        else {
          document.getElementById("trigger-edit")?.click();
          document.getElementById("trigger-delete")?.click();
        }
        
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <button id="trigger-edit"></button>
        </DialogTrigger>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Edit message</DialogTitle>
            <DialogDescription>
              Make changes to your message here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Input defaultValue={actionMessage?.text} ref={inputRef} />
          <DialogFooter>
            <Button type="submit" onClick={handleEditMessage}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }