import { create } from 'zustand';

export type IUser = {
    avatar_url: string;
    created_at: string;
    display_name: string;
    id: string;
    rooms: string[];
} | null;

interface UsersState {
    users: IUser[];
    setUsers: (newUsers: IUser[]) => void;
}

export const useUsers = create<UsersState>()((set) => ({
  users: [],
  setUsers: (newUsers) => set(() => ({
    users: newUsers,
  })),
}))