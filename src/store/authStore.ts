import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthState {
  currentUser: User | null;
  registeredUsers: User[];
  isLoading: boolean;
  loadStoredSession: () => Promise<void>;
  register: (user: User) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updated: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

const STORAGE_KEY_USERS = '@app_registered_users';
const STORAGE_KEY_SESSION = '@app_user_session';

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  registeredUsers: [],
  isLoading: true,

  loadStoredSession: async () => {
    try {
      const [usersData, sessionData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_USERS),
        AsyncStorage.getItem(STORAGE_KEY_SESSION),
      ]);
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      const session: User | null = sessionData ? JSON.parse(sessionData) : null;
      set({ registeredUsers: users, currentUser: session, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  register: async (newUser) => {
    const { registeredUsers } = get();
    const exists = registeredUsers.some(
      (u) => u.email.toLowerCase() === newUser.email.toLowerCase()
    );
    if (exists) {
      return { success: false, error: 'User with this email already exists' };
    }
    const updatedList = [...registeredUsers, newUser];
    await AsyncStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedList));
    set({ registeredUsers: updatedList });
    return { success: true };
  },

  login: async (email, password) => {
    const { registeredUsers } = get();
    const target = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!target) {
      return { success: false, error: 'Invalid email or password' };
    }
    await AsyncStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(target));
    set({ currentUser: target });
    return { success: true };
  },

  updateProfile: async (updatedFields) => {
    const { currentUser, registeredUsers } = get();
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedFields };
    const updatedUsers = registeredUsers.map((u) =>
      u.email.toLowerCase() === currentUser.email.toLowerCase() ? updatedUser : u
    );

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updatedUser)),
      AsyncStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers)),
    ]);

    set({ currentUser: updatedUser, registeredUsers: updatedUsers });
  },

  logout: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY_SESSION);
    set({ currentUser: null });
  },
}));
