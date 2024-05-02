import React from "react";
import { Button } from "../button";

export function FriendSkeleton() {
  return (
    <div className="flex border-b cursor-pointer hover:bg-gray-700 items-center py-3 px-2 animate-pulse">
      <div className="h-10 w-10 rounded-full bg-gray-300 mr-5"></div>
      <div>
        <div className="h-4 bg-gray-300 w-32 mb-1 rounded"></div>
        <div className="h-3 bg-gray-300 w-16 rounded"></div>
      </div>
    </div>
  );
}

export function FriendsSkeleton() {
    return(
        <>
        <div className="flex justify-center my-2">
            <Button>Add contacts</Button>
        </div>
            <FriendSkeleton />
            <FriendSkeleton />
            <FriendSkeleton />
            <FriendSkeleton />
            <FriendSkeleton />
            <FriendSkeleton />
            <FriendSkeleton />
        </>
    )
}
