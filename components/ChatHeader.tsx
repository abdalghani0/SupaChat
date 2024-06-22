"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import ChatPresence from "./ChatPresence";
import { useRooms } from "@/lib/store/rooms";
import { useUsers } from "@/lib/store/users";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ListContacts from "./ListContacts";
import { UserRound } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import ThemeSwitcher from "./ThemeSwitcher";

export default function ChatHeader({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { currentRoom } = useRooms();
  const { users } = useUsers();
  const user2 = users?.find((u) => u?.id === currentRoom?.user2_id);
  const currentUser = users?.find((u) => u?.id === currentRoom?.user1_id);
  const roomName =
    user?.id === currentRoom?.user1_id
      ? user2?.display_name
      : currentUser?.display_name;

  const supabase = supabaseBrowser();
  // const isTyping = user?.id === currentRoom?.user1_id ? user2IsTyping : user1IsTyping;

  const handleLoginWithGithub = () => {
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="h-20">
      <div className="p-5 max-sm:px-3 border-b flex items-center justify-between h-full">
        <div>
          <h1 className="text-xl font-bold">
            {user && currentRoom ? roomName : "SupaChat"}
          </h1>

          <ChatPresence />

          {/* isTyping &&
                 <div className="flex gap-1 text-sm items-center">
                    <span>typing</span>
                    <span className="w-1 h-1 rounded-full bg-violet-500 animate-ping"></span>
                    <span className="w-1 h-1  rounded-full bg-violet-500 animate-ping delay-75"></span>
                    <span className="w-1 h-1  rounded-full bg-violet-500 animate-ping delay-100"></span>
                  </div>  
              */}
        </div>

        <div className="flex items-center gap-3">
     
          <ThemeSwitcher />

          {user && <ContactsDrawer />}

          {user ? (
            <Button onClick={handleLogout}>logout</Button>
          ) : (
            <Button onClick={handleLoginWithGithub}>login</Button>
          )}

        </div>
      </div>
    </div>
  );
}

export function ContactsDrawer() {
  return (
    <div className="block md:hidden">
      <Drawer>
        <DrawerTrigger>
          <div className="p-2 cursor-pointer border flex rounded-md">
            <UserRound />
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>select a chat</DrawerTitle>
          </DrawerHeader>
          <ListContacts />
          <DrawerClose className="my-2">
            <Button id="close-drawer">Ok</Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
