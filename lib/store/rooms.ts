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
    addRoom: (newRoom : room) => void;
    setCurrentRoom: (room : room) => void;
    addMessageToRoom: (messaage: Imessage) => void;
    setRoomMessages: (messags : Imessage[]) => void;
    deleteMessageFromRoom: (messageId : string) => void;
}

export const useRooms = create<RoomsState>()((set) => ({
  rooms: [],
  hasMore: true,
  currentRoom: undefined,
  currentRoomMessages: [],
  addRoom: (newRoom) => set((state) => ({
    rooms: [...state.rooms, newRoom],
  })),
  setCurrentRoom: (room) => set(() => ({
    currentRoom: room,
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
}))