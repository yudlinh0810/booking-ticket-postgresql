import { create } from "zustand";

interface UiState {
  isLoading: boolean;
  setLoading: (state: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isLoading: false,
  setLoading: (state) => set({ isLoading: state }),
}));
