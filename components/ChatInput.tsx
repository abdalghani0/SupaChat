"use client";
import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { toast } from "sonner"
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@/lib/store/user';
import { Imessage, useMessage } from '@/lib/store/messages';
import { useRooms } from '@/lib/store/rooms';
import ReplyToMessage from './ReplyToMessage';

function ChatInput() {
    const user = useUser((state) => state.user);
    const {currentRoom, addMessageToRoom} = useRooms();
    const {replyToMessage, setReplyToMessage} = useMessage();
    const addMessage = useMessage((state) => state.addMessage);
    const setOptimisticId = useMessage((state) => state.setOptimisticId);
    const supabase = supabaseBrowser();
    const [replyMessageAppeard, setReplyMessageAppeard] = useState(true);

    useEffect(() => {
        setReplyMessageAppeard(true);
    },[replyToMessage])

    const handleSendMessage = async(text : string) => {
        if(text.trim() && currentRoom) {
            setReplyToMessage(undefined);
            const newMessage = {
                id: uuidv4(),
                text,
                send_by: user?.id,
                is_edit: false,
                created_at: new Date().toISOString(),
                users: {
                    id: user?.id,
                    avatar_url: user?.user_metadata.avatar_url,
                    created_at: new Date().toISOString(),
                    display_name: user?.user_metadata.user_name,
                },
                room_id: currentRoom?.id,
                replying_to: replyToMessage?.id,
            }
            addMessage(newMessage as Imessage);
            addMessageToRoom(newMessage as Imessage);
            setOptimisticId(newMessage.id);
            const {error} = await supabase.from("messages").insert({ id: newMessage.id, text, room_id:newMessage.room_id, replying_to:newMessage.replying_to });
            if(error) {
                toast.error(error.message);
            }
        }
        else {
            toast.error("Message can not be empty");
        }
        if(!currentRoom) {
            toast.error("Select a friend to send a message");
        }
    }
    return (
        <div className="p-5">
            {replyToMessage 
                ?   <div className={`bg-gray-800 mb-1 rounded-sm flex items-center transition-transform duration-300 ${replyMessageAppeard ? "translate-y-0" : "translate-y-6"}`}>
                        <ReplyToMessage message={replyToMessage} style="flex-1"/>
                        <svg onClick={() => {setReplyMessageAppeard(false); setReplyToMessage(undefined)}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" className="cursor-pointer mr-3 lucide lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                    </div>
                :   null 
            }
            <Input dir="auto" placeholder="send message" onKeyDown={(e) => {
                if(e.key === "Enter") {
                    handleSendMessage(e.currentTarget.value);
                    e.currentTarget.value = "";
                }
            }}/>
        </div>
    );
}

export default ChatInput;