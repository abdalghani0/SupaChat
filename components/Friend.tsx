"use client"
import { useUsers } from '@/lib/store/users';
import { Suspense } from 'react';
import Image from 'next/image';
import friendSkeleton from './ui/skeletons/friendSkeleton';
import { useUser } from '@/lib/store/user';
import { room, useRooms } from '@/lib/store/rooms';
import { useMessage } from '@/lib/store/messages';

function Friend({ room, index } : { room : room, index : number }) {
    const {setCurrentRoom, setRoomMessages} = useRooms();
    const {messages} = useMessage();
    const {users} = useUsers();
    const {user} = useUser();
    const currentUser = users.find((u) => u?.id === user?.id);
    let user2 = users.find((u) => u?.id === room.user2_id);
    if(currentUser === user2) 
        user2 = users.find((u) => u?.id === room.user1_id);
    const contact = currentUser?.id === room.user1_id
        ? user2
        : currentUser;

    const handleFriendClick = () => {
        setCurrentRoom(room);
        setRoomMessages(messages.filter((message) => (message.room_id === room.id)));
    }

    return (
        <Suspense fallback={friendSkeleton()}>
            <div 
                className={index === 0 
                ? "flex justify-between items-center cursor-pointer hover:bg-gray-600 py-3 px-2 rounded-md border-y" 
                : "flex justify-between items-center cursor-pointer hover:bg-gray-600 py-3 px-2 rounded-md border-b" }
                onClick={() => handleFriendClick()}
                >
                    <Image 
                        src={contact?.avatar_url!} 
                        alt={contact?.display_name!}
                        width={40}
                        height={40}
                        className="rounded-full ring-2 mr-5"/>
                <p className="text-sm">{contact?.display_name}</p>
            </div>
        </Suspense>
    );
}

export default Friend;