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
import { CornerUpLeft, MoreHorizontal } from 'lucide-react';
import { useUser } from '@/lib/store/user';
import { User } from '@supabase/supabase-js';
import ReplyToMessage from './ReplyToMessage';
import { useState } from 'react';

export default function Message({message} : {message: Imessage}) {
    const user = useUser((state) => state.user);
    const {messages} = useMessage();
    const replyToMessage = message.replying_to ? messages?.find((m) => (m.id === message.replying_to)) : undefined;
    const {setReplyToMessage} = useMessage();

    const handleRepliedMessageClick = () => {
        document.getElementById(replyToMessage?.id!)?.classList.add("bg-gray-700"); 
        setTimeout(() => {
            document.getElementById(replyToMessage?.id!)?.classList.remove("bg-gray-700"); 
        }, 500);
    }

    return (
        <div id={message.id} onDoubleClick={() => setReplyToMessage(message)} className={`rounded-md transision-bg duration-500 ${message.send_by === user?.id ? "" : "flex justify-end"}`}>
            <div className={`flex gap-2 w-fit max-w-md bg-gradient-to-r from-pink-700 to-purple-700 rounded-md p-3 ${message.send_by === user?.id ? "bg-gradient-to-l" : "flex-row-reverse"}`}>
                <div className="shrink-0">
                    <Image 
                        src={message.users?.avatar_url!} 
                        alt={message.users?.display_name!}
                        width={40}
                        height={40}
                        className="rounded-full ring-2" />
                </div>

                <div dir="rtl" className="flex-1 flex-col">

                    <div className={`flex items-center gap-2 justify-between  ${message.send_by === user?.id ? "flex-row-reverse" : ""}`}>
                        <div className={`flex items-center gap-2 ${message.send_by === user?.id ? "flex-row-reverse" : ""}`}>
                            <h1 className="font-bold">{message.users?.display_name}</h1>
                            {message.is_edit && (<h1 className="test-sm text-gray-400">edited</h1>)}
                        </div>
                        <MessageMenu user={user} message={message}/>
                    </div>

                    {message.replying_to
                        ?   <a onClick={() => handleRepliedMessageClick()} href={`#${replyToMessage?.id}`}><ReplyToMessage message={replyToMessage} style={`cursor-pointer bg-gradient-to-r from-pink-900 to-purple-900 ${message.send_by === user?.id ? "bg-gradient-to-l mr-10" : ""}`} /></a>
                        :   null   
                    }

                    <p dir="auto" className={`text-gray-300 w-fit break-all ${message.send_by === user?.id ? "float-left" : ""}`}>{message.text}</p>

                </div>

            </div>
        </div>
        
    );
}

const MessageMenu = ({message, user} : {message : Imessage, user: User | undefined}) => {
    const setActionMessage = useMessage((state) => state.setActionMessage);
    const {setReplyToMessage} = useMessage();
    return(
        <DropdownMenu>
            <DropdownMenuTrigger>
                <MoreHorizontal />
            </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        {new Date(message.created_at).toDateString() + " " + new Date(message.created_at).getHours() + ":" + new Date(message.created_at).getMinutes()}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {setReplyToMessage(message)}} >
                        reply <CornerUpLeft className="w-4 h-4" />
                    </DropdownMenuItem>
                    {message.users?.id === user?.id
                        ?   <DropdownMenuItem 
                                onClick={() => {
                                    document.getElementById("trigger-edit")?.click();
                                    setActionMessage(message);
                            }}>
                                Edit  
                            </DropdownMenuItem>
                        :   null
                    }
                    {message.users?.id === user?.id
                        ?   <DropdownMenuItem 
                                onClick={() => {
                                    document.getElementById("trigger-delete")?.click();
                                    setActionMessage(message);
                            }}>
                                Delete
                            </DropdownMenuItem>
                        :   null
                    }
                </DropdownMenuContent>
        </DropdownMenu>
    )
}