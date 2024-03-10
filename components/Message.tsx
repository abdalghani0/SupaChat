"use client"
import { Imessage, useMessage } from '@/lib/store/messages';
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from 'lucide-react';
import { useUser } from '@/lib/store/user';

export default function Message({message} : {message: Imessage}) {
    const user = useUser((state) => state.user);

    return (
        <div className={`${message.send_by === user?.id ? "" : "flex justify-end"}`}>
            <div className={`flex gap-2 w-fit bg-gradient-to-r from-pink-700 to-purple-700 rounded-md p-3 ${message.send_by === user?.id ? "bg-gradient-to-l" : "flex-row-reverse"}`}>
                <div>
                    <Image 
                        src={message.users?.avatar_url!} 
                        alt={message.users?.display_name!}
                        width={40}
                        height={40}
                        className="rounded-full ring-2" />
                </div>

                <div dir="rtl" className="flex-1 flex-col">

                    <div className={`flex items-center gap-2 justify-between  ${message.send_by === user?.id ? "flex-row-reverse" : ""}`}>
                        <div className="flex items-center gap-2">
                            <h1 className="font-bold">{message.users?.display_name}</h1>
                            {message.is_edit && (<h1 className="test-sm text-gray-400">edited</h1>)}
                        </div>
                        {message.users?.id === user?.id && <MessageMenu message={message}/>}
                    </div>

                    <p  className={`text-gray-300 w-fit  ${message.send_by === user?.id ? "float-left" : ""}`}>{message.text}</p>

                </div>

            </div>
        </div>
        
    );
}

const MessageMenu = ({message} : {message : Imessage}) => {
    const setActionMessage = useMessage((state) => state.setActionMessage)
    return(
        <DropdownMenu>
            <DropdownMenuTrigger>
                <MoreHorizontal />
            </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>{new Date(message.created_at).toDateString() + " " + new Date(message.created_at).getHours() + ":" + new Date(message.created_at).getMinutes()}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onClick={() => {
                            document.getElementById("trigger-edit")?.click();
                            setActionMessage(message);
                    }}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => {
                            document.getElementById("trigger-delete")?.click();
                            setActionMessage(message);
                    }}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
        </DropdownMenu>
    )
}