"use client";
import React from 'react';
import { Input } from './ui/input';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { toast } from "sonner"
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@/lib/store/user';
import { Imessage, useMessage } from '@/lib/store/messages';
import { useRooms } from '@/lib/store/rooms';

function ChatInput() {
    const user = useUser((state) => state.user);
    const {currentRoom, addMessageToRoom, currentRoomMessages} = useRooms();
    const addMessage = useMessage((state) => state.addMessage);
    const setOptimisticId = useMessage((state) => state.setOptimisticId);
    const supabase = supabaseBrowser();

    const handleSendMessage = async(text : string) => {
        if(text.trim() && currentRoom) {
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
                room_id: currentRoom?.id
            }
            addMessage(newMessage as Imessage);
            addMessageToRoom(newMessage as Imessage);
            setOptimisticId(newMessage.id);
            console.log("new message 2");
            const {error} = await supabase.from("messages").insert({ text, room_id:newMessage.room_id });
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
            <Input placeholder="send message" onKeyDown={(e) => {
                if(e.key === "Enter") {
                    handleSendMessage(e.currentTarget.value);
                    e.currentTarget.value = "";
                }
            }}/>
        </div>
    );
}

export default ChatInput;