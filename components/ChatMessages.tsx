import React, { Suspense } from 'react';
import ListMessages from './ListMessages';
import { supabaseServer } from '@/lib/supabase/server';
import InitMessages from '@/lib/store/initMessages';
import { Imessage } from '@/lib/store/messages';

export default async function ChatMessages({userRooms} : {userRooms : string[]}) {
    const supabase = await supabaseServer();
    const rooms : string[] = userRooms ? userRooms : [];
    const {data} = await supabase
        .from("messages")
        .select("*, users(*)")
        .in("room_id", rooms)
        .order("created_at", {ascending: false});

    return (
        <Suspense fallback="loading..">
            <ListMessages/>
            <InitMessages messages={data?.reverse() as Imessage[]}/>
        </Suspense>
    );
}