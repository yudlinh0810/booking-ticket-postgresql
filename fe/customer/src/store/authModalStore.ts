import { create } from "zustand";

type AuthModalType = "login" | "register" | "OTP" | "forgotPassword";

interface AuthModalStore {
  isOpen: boolean;
  type: AuthModalType;
  openModal: (type: AuthModalType) => void;
  closeModal: () => void;
  setType: (type: AuthModalType) => void;
}

export const useAuthModalStore = create<AuthModalStore>((set) => ({
  isOpen: false,
  type: "login",
  openModal: (type: AuthModalType) => set({ isOpen: true, type }),
  closeModal: () => set({ isOpen: false }),
  setType: (type: AuthModalType) => set({ type }),
}));
