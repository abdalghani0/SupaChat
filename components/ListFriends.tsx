import { room } from '@/lib/store/rooms';
import React from 'react';
import Friend from './Friend';
import { ScrollArea } from './ui/scroll-area';

function ListFriends({ rooms } : { rooms : room[] }) {

    return (
        <ScrollArea className="overflow-y-auto">
            {rooms?.map((room, index) => (
                <Friend key={index} room={room} index={index} />
            ))}
        </ScrollArea>
    );
}

export default ListFriends;
