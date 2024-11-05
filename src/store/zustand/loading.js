import { create  } from "zustand";

const useLoadingStore = create((set) => ({
    showLoading: false,
    updateShow: (show) => (set({showLoading: show}))
}));

export default useLoadingStore;