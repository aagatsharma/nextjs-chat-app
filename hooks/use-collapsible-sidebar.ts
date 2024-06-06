import { create } from "zustand";

interface SidebarStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCollapsibleSidebar = create<SidebarStore>((set) => ({
  isOpen: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
