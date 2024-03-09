"use client"
import { IUser, useUsers } from "@/lib/store/users";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { v4 as uuidv4 } from 'uuid';
import Image from "next/image";
import { useUser } from "@/lib/store/user";
import { toast } from "sonner";
import { useRooms } from "@/lib/store/rooms";

function Contact({user} : {user:IUser}) {
    const {users, setUsers} = useUsers();
    const { rooms, addRoom } = useRooms();
    const user1 = useUser((state) => state.user);
    const user1Rooms = users.find((usr) => usr?.id === user1?.id)?.rooms as string[];
    const user2Rooms = users.find((usr) => usr?.id === user?.id)?.rooms as string[];
    const supabase = supabaseBrowser();

    const addContact = async () => {
        const newRoom = {
            id: uuidv4(),
            created_at: new Date().toISOString(),
            user1_id: user1?.id,
            user2_id: user?.id
        }
        const roomExists = rooms.find((room) => ((room.user1_id === newRoom.user1_id && room.user2_id === newRoom.user2_id) || (room.user1_id === newRoom.user1_id && room.user2_id === newRoom.user2_id)));
        if(!roomExists) {
            addRoom(newRoom);
            const {error} = await supabase.from("rooms").insert(newRoom);
            const user1Update = await supabase.from("users").update({rooms: [...user1Rooms, newRoom.id]}).eq("id", user1?.id!);
            const user2Update = await supabase.from("users").update({rooms: [...user2Rooms, newRoom.id]}).eq("id", user?.id!);
            setUsers(users.filter((usr) => {
                if(usr?.id === user1?.id) {
                    usr?.rooms.push(newRoom.id);
                }
                if(usr?.id === user?.id) {
                    usr?.rooms.push(newRoom.id);
                }
                return usr;
            }));
            if(error) {
                toast.error(error.message);
            }
            if(user1Update.error || user2Update.error) {
                toast.error("Error while creating contact")
            }
        }
        else {
            toast.error("Contact already exists");
        }
    }

    return (
        <div 
            className="flex justify-between cursor-pointer hover:bg-gray-600 py-3 px-2 rounded-md"
            onClick={() => addContact()}>
            <Image 
                src={user?.avatar_url!} 
                alt={user?.display_name!}
                width={25}
                height={25}
                className="rounded-full ring-2" />
            <p>{user?.display_name}</p>
        </div>
    );
}

export default Contact;