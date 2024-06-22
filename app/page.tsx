"use server";
import React from "react";
import ChatHeader from "@/components/ChatHeader";
import InitUser from "@/lib/store/initUser";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import { supabaseServer } from "@/lib/supabase/server";
import Contacts from "@/components/Contacts";
import ChatAI from "@/components/ChatAI";

export default async function Page() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getSession();
  const userRooms = await supabase
    .from("users")
    .select("rooms")
    .eq("id", data.session?.user.id as string)
    .single();

  return (
    <>
      <div className="max-w-4xl mx-auto md:py-10 h-dvh flex gap-5">
        {data.session?.user.id ? (
          <div className="w-56 hidden md:flex flex-col overflow-auto h-full border rounded-md">
            <Contacts userId={data.session?.user.id} />
          </div>
        ) : null}

        <div className="h-full border rounded-md flex flex-col flex-1 relative">
          <ChatHeader user={data.session?.user} />

          {data.session?.user ? (
            <>
              <ChatMessages userRooms={userRooms.data?.rooms!} />
              <ChatInput />
            </>
          ) : (
            <ChatAI />
          )}
        </div>
      </div>
      <InitUser user={data.session?.user} />
    </>
  );
}
