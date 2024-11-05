import { create } from "zustand";

const toast = create((set) => ({
  showToast: false,
  setShowToast: () => set((state) => ({ showToast: !state.showToast })),
}));

export default toast;
