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
import { Transition } from '@headlessui/react';

function ChatInput() {
    const user = useUser((state) => state.user);
    const {currentRoom, addMessageToRoom} = useRooms();
    const {replyToMessage, setReplyToMessage, addMessage} = useMessage();
    const setOptimisticId = useMessage((state) => state.setOptimisticId);

    const handleSendMessage = async(text : string) => {
        const supabase = supabaseBrowser();
        if(!currentRoom) {
            toast.warning("Select a friend to send a message");
        }
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
            else   
                console.log("message sent");
        }
        else {
            toast.error("Message can not be empty");
        }
    }
    /*
    useEffect(() => {
        const channel = supabase
        .channel("chat-room")
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms' }, 
            payload => {
            console.log(payload);
            if(payload.new.user1_id === user?.id){
                setUser2IsTyping(payload.new.user2_is_typing);
            }
            else if(payload.new.user2_id === user?.id){
                setUser1IsTyping(payload.new.user1_is_typing);
            }
            }
        )
        .subscribe()
    
        return() => {
            channel.unsubscribe();
        }
    }, [user1IsTyping, user2IsTyping])

    const handleTyping = async () => {
        const supabase = supabaseBrowser();
        if(currentRoom?.user1_id === user?.id && currentRoom) {
            const {error} = await supabase.from("rooms").update({user1_is_typing: true}).eq("id", currentRoom?.id!);
            if(error) {
                toast.error(error.message);
            }
            else
                setUser1IsTyping(true);
        }
        else if(currentRoom?.user2_id === user?.id && currentRoom) {
            const {error} = await supabase.from("rooms").update({user2_is_typing: true}).eq("id", currentRoom?.id!);
            if(error) {
                toast.error(error.message);
            }
            else
                setUser2IsTyping(true);
        }
    }

    const debouncedTyping = debounce(handleTyping, 2500, {immediate: true});
    const typingHandler = useCallback(debouncedTyping,[user1IsTyping, user2IsTyping]);

    const handleStopedTyping = async() => {
        const supabase = supabaseBrowser();
            if(currentRoom?.user1_id === user?.id && currentRoom) {
                const {error} = await supabase.from("rooms").update({user1_is_typing: false}).eq("id", currentRoom?.id!);
                if(error) {
                    toast.error(error.message);
                }
                else
                    setUser1IsTyping(false);
            }
            else if(currentRoom?.user2_id === user?.id && currentRoom) {
                const {error} = await supabase.from("rooms").update({user2_is_typing: false}).eq("id", currentRoom?.id!);
                if(error) {
                    toast.error(error.message);
                }
                else
                    setUser2IsTyping(false);
            }
    }

    const debouncedStoped = debounce(handleStopedTyping, 2500);
    const stopedTypingHandler = useCallback(debouncedStoped, [user1IsTyping, user2IsTyping]);

    */

    return (
        <div className="px-5 py-3">
            <Transition
                show={replyToMessage? true : false}
                enter="transition-transform duration-100"
                enterFrom="translate-y-10"
                enterTo="translate-y-0"
                leave="transition-transform duration-75"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-5"
            >
                <div className={`bg-gray-800 mb-1 rounded-sm flex items-center`}>
                    <ReplyToMessage message={replyToMessage} style="flex-1"/>
                    <svg onClick={() => setReplyToMessage(undefined)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" className="cursor-pointer mr-3 lucide lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                </div>
            </Transition> 
            <Input 
                id="chat-input"
                dir="auto"
                placeholder="send message"
                onKeyDown={(e) => {
                    if(e.key === "Enter") {
                        handleSendMessage(e.currentTarget.value);
                        e.currentTarget.value = "";
                    }
                }}
            />
        </div>
    );
}

export default ChatInput;