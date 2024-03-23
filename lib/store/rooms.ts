import { create } from 'zustand';
import { Imessage } from './messages';

export type room = {
  id: string,
  user1_id: string | undefined,
  user2_id: string | undefined,
  created_at: string,
}

interface RoomsState {
    rooms: room[];
    currentRoom: room | undefined;
    currentRoomMessages: Imessage[];
    hasMore: boolean;
    isTyping: boolean;
    user1IsTyping: boolean;
    user2IsTyping: boolean;
    addRoom: (newRoom : room) => void;
    setCurrentRoom: (room : room) => void;
    setIsTyping: (bool: boolean) => void;
    setUser1IsTyping: (bool: boolean) => void;
    setUser2IsTyping: (bool: boolean) => void;
    addMessageToRoom: (messaage: Imessage) => void;
    setRoomMessages: (messags : Imessage[]) => void;
    deleteMessageFromRoom: (messageId : string) => void;
    updateMessageInRoom: (updatedMessage: Imessage) => void;
}

export const useRooms = create<RoomsState>()((set) => ({
  rooms: [],
  hasMore: true,
  isTyping: false,
  user1IsTyping: false,
  user2IsTyping: false,
  currentRoom: undefined,
  currentRoomMessages: [],
  addRoom: (newRoom) => set((state) => ({
    rooms: [...state.rooms, newRoom],
  })),
  setCurrentRoom: (room) => set(() => ({
    currentRoom: room,
  })),
  setIsTyping: (bool) => set(() => ({
    isTyping: bool,
  })),
  setUser1IsTyping: (bool) => set(() => ({
    user1IsTyping: bool,
  })),
  setUser2IsTyping: (bool) => set(() => ({
    user2IsTyping: bool,
  })),
  addMessageToRoom: (message) => set((state) => ({
    currentRoomMessages: [...state.currentRoomMessages, message],
  })),
  setRoomMessages: (messages) => set(() => ({
    currentRoomMessages: messages,
  })),
  deleteMessageFromRoom:(messaageId) => set((state) => ({
    currentRoomMessages: state.currentRoomMessages.filter((m) => (m.id !== messaageId)),
  })),
  updateMessageInRoom: (updatedMessage) => 
    set((state) => {
        return {
          currentRoomMessages:
            state.currentRoomMessages.filter((message) => {
                if(message.id === updatedMessage.id) {
                message.text = updatedMessage.text;
                message.is_edit = updatedMessage.is_edit;
              }
              return message;
            })
        }
  })
}))