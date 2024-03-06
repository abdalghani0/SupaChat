"use client";
import React from 'react';
import { Button } from './ui/button';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { User } from "@supabase/supabase-js"
import { useRouter } from 'next/navigation';
import ChatPresence from './ChatPresence';
import { useRooms } from '@/lib/store/rooms';
import { useUsers } from '@/lib/store/users';

export default function ChatHeader({ user } : { user: User | undefined}) {

    const router = useRouter();
    const {currentRoom} = useRooms();
    const {users} = useUsers();
    const user2 = users.find((u) => (u?.id === currentRoom?.user2_id));
    const currentUser = users.find((u) => (u?.id === currentRoom?.user1_id));
    const roomName = 
      user?.id === currentRoom?.user1_id 
        ? user2?.display_name 
        : currentUser?.display_name;
    console.log("room: " + roomName)

    const handleLoginWithGithub = () => {
        const supabase = supabaseBrowser();
        supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: location.origin + "/auth/callback",
            }
        });
    };

    const handleLogout = async() => {
        const supabase = supabaseBrowser();
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <div className="h-20">

          <div className="p-5 border-b flex items-center justify-between h-full">

            <div>

              <h1 className="text-xl font-bold">{user && currentRoom ? roomName : "SupaChat"}</h1>

              <ChatPresence/>

            </div>

            {user ?  <Button onClick={handleLogout}>logout</Button>
                  :   <Button onClick={handleLoginWithGithub}>login</Button>
            }

          </div>

        </div>
    );
}
