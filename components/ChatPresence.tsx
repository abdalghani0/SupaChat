"use client";
import { useRooms } from "@/lib/store/rooms";
import { useUser } from "@/lib/store/user";
import { useUsers } from "@/lib/store/users";
import { supabaseBrowser } from "@/lib/supabase/browser";
import React, { useEffect, useState } from "react";

function ChatPresence() {
  const user = useUser((state) => state.user);
  const {users} = useUsers();
  const { currentRoom } = useRooms();
  const friend =
    user?.id === currentRoom?.user1_id
      ? currentRoom?.user2_id
      : currentRoom?.user1_id;
  const supabase = supabaseBrowser();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friendOnline, setFriendOnline] = useState(false);
  const user2 = users?.find((u) => u?.id == currentRoom?.user2_id)?.display_name;

  useEffect(() => {
    const channel = supabase.channel("room1");
    channel
      .on("presence", { event: "sync" }, () => {
        console.log("Synced presence state: ", channel.presenceState());
        const userIds = [];
        for (const id in channel.presenceState()) {
          // @ts-ignore
          userIds.push(channel.presenceState()[id][0].user_id);
        }
        setOnlineUsers([...new Set(userIds)] as []);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
          });
        }
      });
  }, [user]);

  useEffect(() => {
    //@ts-ignore
    setFriendOnline(onlineUsers.includes(friend));
  }, [currentRoom, onlineUsers]);

  return (
    <div className="flex items-center gap-1">
      <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>

      <h1 className="text-sm text-gray-600 dark:text-gray-400">
        {friendOnline || user2 == "Supabase AI" || !user ? "online" : "offline"}
      </h1>
    </div>
  );
}

export default ChatPresence;
