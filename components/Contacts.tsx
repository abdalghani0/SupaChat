import { supabaseServer } from "@/lib/supabase/server";
import ListContacts from "./ListContacts";
import InitUsers from "@/lib/store/initUsers";
import { IUser } from "@/lib/store/users";
import { room } from "@/lib/store/rooms";
import InitRooms from "@/lib/store/initRooms";

export default async function Contacts({userId} : {userId : string | undefined}) {
    const supabase = await supabaseServer();
    const {error,data} = await supabase.from("users").select(".");
    if(error) {
        console.log(error.message);
    }
    const users = data as unknown as IUser[];
    const currentUser = users?.find((usr) => usr?.id === userId);
    const fetchedRooms: room[] = [];
    try {
        for (const roomId of currentUser?.rooms!) {
            const { data, error } = await supabase.from("rooms").select("*").eq("id", roomId).single();
            if (error) {
                throw error;
            }
            if (data) {
                fetchedRooms.push(data);
            }
        }
    } catch (error) {
        console.error("Error fetching rooms:", error);
        // Handle error here if needed
    }

    return (
        <>
            <ListContacts/>
            <InitUsers users={users}/>
            <InitRooms rooms={fetchedRooms}/>
        </>
    );
}