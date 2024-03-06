"use server";
import React from "react";
import ChatHeader from "@/components/ChatHeader";
import InitUser from "@/lib/store/initUser";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import ChatAbout from "@/components/ChatAbout";
import { supabaseServer } from "@/lib/supabase/server";
import Contacts from "@/components/Contacts";

export default async function Page() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getSession();
  const userRooms = await supabase.from("users").select("rooms").eq("id", data.session?.user.id as string).single();
  console.log(userRooms.data?.rooms);
  return (
    <>
      <div className="max-w-5xl mx-auto md:py-10 h-screen flex gap-5">

        <div className="max-w-60 overflow-auto h-full border rounded-md flex flex-col">
          <Contacts userId={data.session?.user.id}/>
        </div>

        <div className="h-full border rounded-md flex flex-col flex-1 relative">
        
          <ChatHeader user={data.session?.user} />
          
          {data.session?.user 
           
            ?   <>
                  <ChatMessages userRooms={userRooms.data?.rooms as string[]}/>
                  <ChatInput/>
                </>
            : <ChatAbout/>
          }
          
        </div>

      </div>
      <InitUser user={data.session?.user}/>
    </>
  );
}

