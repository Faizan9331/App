import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GalleryImage } from '../types';

interface GalleryState {
  favorites: GalleryImage[];
  loadFavorites: () => Promise<void>;
  toggleFavorite: (image: GalleryImage) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

const STORAGE_KEY_FAVORITES = '@app_favorites';

export const useGalleryStore = create<GalleryState>((set, get) => ({
  favorites: [],

  loadFavorites: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY_FAVORITES);
      if (data) set({ favorites: JSON.parse(data) });
    } catch (e) {}
  },

  toggleFavorite: async (image) => {
    const { favorites } = get();
    const exists = favorites.some((f) => f.id === image.id);
    const updated = exists
      ? favorites.filter((f) => f.id !== image.id)
      : [...favorites, image];

    set({ favorites: updated });
    await AsyncStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(updated));
  },

  isFavorite: (id) => get().favorites.some((f) => f.id === id),
}));
