"use client"
import { useRooms } from '@/lib/store/rooms';
import React from 'react';
import Friend from './Friend';

function ListFriends() {
    const { rooms } = useRooms();

    return (
        <div>
            {rooms.map((room, index) => (
                <Friend key={index} room={room} index={index} />
            ))}
        </div>
    );
}

export default ListFriends;
