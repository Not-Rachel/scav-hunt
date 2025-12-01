import { create } from 'zustand';

interface ItemsState {
  items: any[] | null;
  setItems: (items: any[]) => void;
  clearItems: () => void;
}

export const useItemStore = create<ItemsState>((set) => ({
  items: null,
  setItems: (items) => set({ items }),
  clearItems: () => set({ items: null }),
}));
