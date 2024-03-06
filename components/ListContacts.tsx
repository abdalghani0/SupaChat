"use client"
import { Button } from "./ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
import Contact from "./Contact";
import { useUsers } from "@/lib/store/users";
import { useUser } from "@/lib/store/user";
import ListFriends from "./ListFriends";

function ListContacts() {
    const {users} = useUsers();

    return (
        <>
            <div className="my-2">
                <Popover>
                    <PopoverTrigger className="w-full"><Button>Add contacts</Button></PopoverTrigger>
                    <PopoverContent>
                                {users?.map((value, index) => {
                                    return(
                                        <Contact key={index} user={value}/>
                                    );
                                })}
                    </PopoverContent>
                </Popover>
            </div>
            
            <div className="flex flex-col">
                <ListFriends />
            </div>
        </>
    );
}

export default ListContacts;