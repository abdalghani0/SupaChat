"use client";
import React from 'react';
import { Button } from './ui/button';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { User } from "@supabase/supabase-js"
import { useRouter } from 'next/navigation';
import ChatPresence from './ChatPresence';
import { useRooms } from '@/lib/store/rooms';
import { useUsers } from '@/lib/store/users';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Contacts from './Contacts';
import ListContacts from './ListContacts';
import { MoreHorizontal } from 'lucide-react';


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
            
            <div className="flex gap-3">
              {user 
                ? <ContactsDrawer />
                : null
              }
              

              {user ? <Button onClick={handleLogout}>logout</Button>
                    : <Button onClick={handleLoginWithGithub}>login</Button>
              }

            </div>

          </div>

        </div>
    );
}

export function ContactsDrawer() {
  return(
    <div className="block md:hidden">
      <Drawer>
        <DrawerTrigger><button className="p-2 border flex rounded-md">chats <MoreHorizontal className="ml-1"/></button></DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>select a chat</DrawerTitle>
            </DrawerHeader>
            <ListContacts/>
            <DrawerClose className="my-2">
              <Button>Ok</Button>
            </DrawerClose>
          </DrawerContent>
      </Drawer>
    </div>
  )
}
