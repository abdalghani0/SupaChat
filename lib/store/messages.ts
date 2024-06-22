import { create } from 'zustand'
import { LIMIT_MESSAGE } from '../constants/idex';

export type Imessage = {
    created_at: string;
    id: string;
    is_edit: boolean;
    send_by: string;
    text: string;
    users: {
        avatar_url: string;
        created_at: string;
        display_name: string;
        id: string;
    } | null;
    room_id: string;
    replying_to: string;
}

export type aiMessage = {
    send_by: string;
    text: string;
}

interface MessageState {
    page: number;
    messages: Imessage[];
    aiMessages: Imessage[];
    actionMessage: Imessage | undefined;
    optimisticId: string[];
    replyToMessage: Imessage | undefined;
    addMessage: (message: Imessage) => void;
    addToAiMessages: (message: Imessage) => void;
    setMessages: (messages: Imessage[]) => void;
    setActionMessage: (message: Imessage) => void;
    setReplyToMessage: (message: Imessage | undefined) => void;
    setOptimisticId: (id: string) => void;
    optimisticDeleteMessage: (messageId: string) => void;
    optimisticUpdateMessage: (updatedMessage: Imessage) => void;
}

export const useMessage = create<MessageState>()((set) => ({
    page: 1,
    messages: [],
    aiMessages: [],
    actionMessage: undefined,
    replyToMessage: undefined,
    optimisticId: [],
    addMessage: (newMessage) => set((state) => ({
        messages: [...state.messages, newMessage], 
    })),
    addToAiMessages: (newMessage) => set((state) => ({
        aiMessages: [...state.aiMessages, newMessage], 
    })),
    setMessages: (messages) => set((state) => ({
        messages: [...messages, ...state.messages], 
        page: state.page + 1,
        hasMore: messages.length >= LIMIT_MESSAGE,
    })),
    setActionMessage: (message) => set(() => ({ actionMessage: message})),
    setOptimisticId: (id) => set((state) => ({optimisticId: [...state.optimisticId, id]})),
    setReplyToMessage: (message) => set(() => ({replyToMessage: message})),
    optimisticDeleteMessage: (messageId) => 
        set((state) => {
            return {
                messages:state.messages.filter(
                    (message) => message.id !== messageId
                    )
            }
        }),
    optimisticUpdateMessage: (updatedMessage) => 
        set((state) => {
            return {
                messages:state.messages.filter((message) => {
                        if(message.id === updatedMessage.id) {
                            message.text = updatedMessage.text;
                            message.is_edit = updatedMessage.is_edit;
                        }
                        return message;
                    })
            }
        })
}))