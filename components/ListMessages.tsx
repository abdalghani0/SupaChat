"use client";
import { Imessage, useMessage } from "@/lib/store/messages";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { DeleteAlert, EditAlert } from "./MessageAction";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { ArrowDown } from "lucide-react";
import { useUser } from "@/lib/store/user";
import { useRooms } from "@/lib/store/rooms";
import Image from "next/image";
import { useUsers } from "@/lib/store/users";
import ChatAI from "./ChatAI";

export default function ListMessages() {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const {
    messages,
    addMessage,
    optimisticId,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
  } = useMessage((state) => state);
  const user = useUser((state) => state.user);
  const { users } = useUsers();
  const {
    currentRoom,
    addMessageToRoom,
    currentRoomMessages,
    deleteMessageFromRoom,
    updateMessageInRoom,
  } = useRooms();
  const supabase = supabaseBrowser();
  const [userScrolled, setUserScrolled] = useState(false);
  const [notification, setNotification] = useState(0);

  useEffect(() => {
    //real time insert, delete, update listener for messages from all contacts
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          //checking if the message is not sent by the currentUser and if the message belongs to any of the user's rooms
          // to avoid adding unrelated messages to the messages state
          if (!optimisticId.includes(payload.new.id)) {
            console.log(payload);
            const { error, data } = await supabase
              .from("users")
              .select(".")
              .eq("id", payload.new.send_by)
              .single();
            if (error) {
              toast.error(error.message);
            } else {
              const newMessage = {
                ...payload.new,
                users: data,
              };
              console.log(newMessage);
              if (payload.new.send_by !== user?.id) {
                addMessage(newMessage as unknown as Imessage);
                addMessageToRoom(newMessage as unknown as Imessage);
              }
            }
          }
          const scrollContainer = scrollRef.current;
          if (
            scrollContainer.scrollTop <
            scrollContainer.scrollHeight -
            scrollContainer.clientHeight -
            10 &&
            payload.new.room_id === currentRoom?.id
          )
            setNotification((current) => current + 1);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          console.log("Change received!", payload);
          optimisticUpdateMessage(payload.new as Imessage);
          updateMessageInRoom(payload.new as Imessage);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          console.log("Change received!", payload);
          optimisticDeleteMessage(payload.old.id);
          deleteMessageFromRoom(payload.old.id);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [messages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [currentRoomMessages]);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      setUserScrolled(isScroll);
      if (
        scrollContainer.scrollTop >
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        setNotification(0);
      }
    }
  };
  const scrollDown = () => {
    setNotification(0);
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  return (
    <>
      {currentRoom ? (
        <div
          ref={scrollRef}
          className="flex-1 flex flex-col p-5 max-sm:px-3 h-full overflow-y-auto"
          onScroll={handleOnScroll}
        >
          <div className="flex-1 mb-5">
            {/* 
                      <LoadMoreMessages/>
                    */}
          </div>

          <div className="flex-col scroll-smooth space-y-7">
            {currentRoomMessages.map((value, index) => {
              return <Message key={index} message={value} />;
            })}
          </div>

          <DeleteAlert />
          <EditAlert />
        </div>
      ) : (
        <div className="m-auto text-xl md:text-2xl space-y-2">
          <Image
            src="/chat.jpg"
            alt="chatting icon"
            width={80}
            height={80}
            className="mx-auto"
          />
          <p>Select a friend to chat with</p>
        </div>
      )}

      {userScrolled && (
        <div className="absolute bottom-20 flex-col self-center">
          {notification ? (
            <div
              className="w-36 mx-auto bg-indigo-500 p-1 rounded-md cursor-pointer"
              onClick={scrollDown}
            >
              <h1>New {notification} messages</h1>
            </div>
          ) : (
            <div className="w-10 text-white h-10 bg-violet-500 rounded-full justify-center items-center flex mx-auto cursor-pointer hover:scale-110 transision-all">
              <button
                className="border-0"
                id="arrow-down"
                onClick={() => scrollDown()}
              >
                <ArrowDown />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
