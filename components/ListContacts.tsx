"use client";
import Contact from "./Contact";
import { useUsers } from "@/lib/store/users";
import ListFriends from "./ListFriends";
import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useUser } from "@/lib/store/user";
import { room, useRooms } from "@/lib/store/rooms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";

function ListContacts() {
  const { users } = useUsers();
  const { user } = useUser();
  const currentUser = users?.find((u) => u?.id === user?.id);
  const { rooms, addRoom } = useRooms();
  const supabase = supabaseBrowser();

  useEffect(() => {
    //real time insert listener for rooms from all contacts
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "rooms" },
        async (payload) => {
          if (
            !currentUser?.rooms.includes(payload.new.id) &&
            currentUser?.id === payload.new.user2_id
          ) {
            console.log(payload);
            addRoom(payload.new as room);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [rooms]);

  return (
    <>
      <div className="my-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full border-0 ring-0 outline-0">
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Add contacts
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>contacts</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[200px] overflow-y-auto">
              {users?.map((value, index) => {
                return (
                  <DropdownMenuItem key={index}>
                    <Contact user={value} />
                  </DropdownMenuItem>
                );
              })}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ListFriends rooms={rooms} />
    </>
  );
}

export default ListContacts;
