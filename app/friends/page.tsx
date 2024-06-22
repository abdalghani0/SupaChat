"use client"
import Contacts from '@/components/Contacts';
import ListFriends from '@/components/ListFriends';
import { useRooms } from '@/lib/store/rooms';
import { useUser } from '@/lib/store/user';
import React from 'react';

export default function page() {
    const {user} = useUser();
    const {rooms} = useRooms();
    return (
        <div>
            <Contacts userId={user?.id} />
            <ListFriends rooms={rooms}/>
        </div>
    );
}
