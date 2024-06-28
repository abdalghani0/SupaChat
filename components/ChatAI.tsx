"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { HfInference } from "@huggingface/inference";
import { Imessage, useMessage } from "@/lib/store/messages";
import Message from "./Message";
import { v4 as uuidv4 } from "uuid";
import { Transition } from "@headlessui/react";
import ReplyToMessage from "./ReplyToMessage";
import { X } from "./ChatInput";
import { toast } from "sonner";
import { ArrowDown } from "lucide-react";

function ChatAI() {
  const { aiMessages, addToAiMessages, replyToMessage, setReplyToMessage } =
    useMessage();
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [isShown, setIsShown] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const [notification, setNotification] = useState(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [aiMessages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (
      scrollContainer.scrollTop <
      scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
    )
      setNotification((current) => current + 1);
  }, [aiMessages]);

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
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  const handleTalkToAi = async (message: string) => {
    if (aiMessages.at(aiMessages.length - 1)?.send_by === "0") {
      toast.error("The AI chat Sequence Must Be User, Ai, User, Ai. Delete Your Last Message If It Wasn't Answered By The Ai");
    }
    else if (message.trim()) {
      const hf = new HfInference("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");
      const newMessage = {
        id: uuidv4(),
        text: message,
        send_by: "0",
        is_edit: false,
        created_at: new Date().toISOString(),
        users: {
          id: "0",
          avatar_url: "/chat.jpg",
          created_at: new Date().toISOString(),
          display_name: "You",
        },
        room_id: "0",
        replying_to: replyToMessage?.id,
      };
      addToAiMessages(newMessage as Imessage);
      setReplyToMessage(undefined);
      try {
        const messages = [...aiMessages, newMessage];

        const out = await hf.chatCompletion({
          model: "mistralai/Mistral-7B-Instruct-v0.2",
          messages: messages.map(message => {
            return { role: message.send_by === "0" ? "user" : "assistant", content: message.text }
          }),
          max_tokens: 500,
          temperature: 0.1,
          seed: 0,
        });

        const aiMessage = {
          id: uuidv4(),
          text: out.choices[0].message.content,
          send_by: "1",
          is_edit: false,
          created_at: new Date().toISOString(),
          users: {
            id: "1",
            avatar_url: "/ai.png",
            created_at: new Date().toISOString(),
            display_name: "SupaChat AI",
          },
          room_id: "0",
          replying_to: newMessage.id,
        };
        addToAiMessages(aiMessage as Imessage);
      } catch (error) {
        //@ts-ignore
        toast.error(error.message);
      }
    }
    else {
      toast.error("Message can not be empty");
    }
  };

  return (
    <>
      <div
        className="flex-1 flex flex-col gap-7 p-5 max-sm:px-3 h-full overflow-y-auto"
        ref={scrollRef}
        onScroll={handleOnScroll}
      >
        {isShown ? (
          <>
            <div className="flex-1"></div>

            <div className="flex-col scroll-smooth space-y-7">
              {aiMessages.map((value, index) => {
                return <Message key={index} message={value} />;
              })}
            </div>
          </>
        ) : (
          <div className="m-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-8 ">Welcome To SupaChat</h2>
            <p className="text-gray-600 leading-6 dark:text-gray-300 font-semibold text-sm ">
              This is a chat application powered by supabase realtime db. You
              could talk to Supabase AI before loging in, login to talk with
              friends and save your conversation with the AI.
            </p>
          </div>
        )}
      </div>

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
            <div className="w-10 h-10 text-white bg-violet-500 rounded-full justify-center items-center flex mx-auto border cursor-pointer hover:scale-110 transision-all">
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

      <div className="px-5 max-sm:px-3 py-3">
        <Transition
          show={replyToMessage ? true : false}
          enter="transition-transform duration-100"
          enterFrom="translate-y-10"
          enterTo="translate-y-0"
          leave="transition-transform duration-75"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-5"
        >
          <div
            className={`bg-gray-400 text-white dark:bg-gray-800 mb-1 rounded-sm flex items-center`}
          >
            <ReplyToMessage
              message={replyToMessage}
              style="flex-1 text-white"
            />
            <X />
          </div>
        </Transition>
        <Input
          placeholder="send message"
          id="ai-input"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleTalkToAi(e.currentTarget.value);
              setIsShown(true);
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
    </>
  );
}

export default ChatAI;
