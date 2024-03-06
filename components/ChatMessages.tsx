import React, { Suspense } from 'react';
import ListMessages from './ListMessages';
import { supabaseServer } from '@/lib/supabase/server';
import InitMessages from '@/lib/store/initMessages';
import { LIMIT_MESSAGE } from '@/lib/constants/idex';
import { Imessage } from '@/lib/store/messages';

export default async function ChatMessages({userRooms} : {userRooms : string[]}) {
    const supabase = await supabaseServer();
    const {data} = await supabase
        .from("messages")
        .select("*, users(*)")
        .in("room_id", userRooms)
        .range(0,LIMIT_MESSAGE)
        .order("created_at", {ascending: false});
    console.log(data);

    return (
        <Suspense fallback="loading..">
            <ListMessages/>
            <InitMessages messages={data?.reverse() as Imessage[] || []}/>
        </Suspense>
    );
}