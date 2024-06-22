import React from "react";
import Image from "next/image";

export default function WelcomeMessage({ message }: { message: string }) {
  return (
    <div
      className={`flex gap-2 text-sm w-fit max-w-md bg-gradient-to-r from-pink-700 to-purple-700 rounded-md p-3 rounded-md transision-bg duration-500`}
    >
      <div className="shrink-0">
        <Image
          src="/chat.jpg"
          alt="logo"
          width={40}
          height={40}
          className="rounded-full ring-2"
        />
      </div>

      <div className="flex-1 flex-col justify-end">
        <h1 className="font-bold">SupaChat</h1>
        <p dir="auto" className={`text-gray-300 w-fit`}>
          {message}
        </p>
      </div>
    </div>
  );
}
