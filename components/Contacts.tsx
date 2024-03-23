import { supabaseServer } from "@/lib/supabase/server";
import ListContacts from "./ListContacts";
import InitUsers from "@/lib/store/initUsers";
import { IUser } from "@/lib/store/users";
import InitRooms from "@/lib/store/initRooms";

export default async function Contacts({userId} : {userId : string | undefined}) {
    const supabase = await supabaseServer();
    const {error,data} = await supabase.from("users").select(".");
    if(error) {
        console.log(error.message);
    }
    const users = data as unknown as IUser[];
    const currentUser = users?.find((usr) => usr?.id === userId);
    const userRooms = currentUser?.rooms! ? currentUser?.rooms! : [];
    const fetchedRooms = await supabase
        .from("rooms")
        .select("*")
        .in("id", userRooms)
        .order("created_at", {ascending: true});
    if(fetchedRooms.error) {
        console.log(fetchedRooms.error?.message);
    }

    return (
        <>
            <ListContacts/>
            <InitUsers users={users}/>
            <InitRooms rooms={fetchedRooms.data!}/>
        </>
    );
}