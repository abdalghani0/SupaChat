"use client";
import React, { useState } from "react";
import WelcomeMessage from "./WelcomeMessage";
import ChatInput from "./ChatInput";
import { Transition } from "@headlessui/react";
import { Input } from "./ui/input";

function ChatAbout() {
  const welcomeMessage = {};
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  setTimeout(() => setShow1(true), 0);
  setTimeout(() => setShow2(true), 1200);
  setTimeout(() => setShow3(true), 2400);

  return (
    <>
      <div className="flex-1 flex flex-col gap-7 p-5 h-full overflow-y-auto">
        <div className="flex-1"></div>
        <Transition
          show={show1}
          enter="transition-all duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <WelcomeMessage message="Welcome to SupaChat!" />
        </Transition>
        <Transition
          show={show2}
          enter="transition-all duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <WelcomeMessage message="This is a chat application that is powered by supabase realtime db" />
        </Transition>
        <Transition
          show={show3}
          enter="transition-all duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <WelcomeMessage message=" Login to send messages" />
        </Transition>
      </div>
      <div className="px-5 py-3">
        <Input placeholder="send message" />
      </div>
    </>
  );
}

export default ChatAbout;
