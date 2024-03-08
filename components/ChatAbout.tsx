import React from 'react';

function ChatAbout() {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-5">
                <h1 className="text-2xl md:text-3xl font-bold">Welcome to SupaChat</h1>
                <p className="w-96">
                    This is a chat application that is powered by supabase realtime db.
                    Login to send messages.
                </p>
            </div>
        </div>
    );
}

export default ChatAbout;