import { create } from "zustand";

const useFormMasterBahasa = create((set) => ({
  isFormChanged: false, // Untuk melacak apakah form diubah
  showPopup: false,
  leavePage: false,
  setIsFormChanged: (value) => set({ isFormChanged: value }),
  setShowPopup: (value) => set({ showPopup: value }),
  setLeavePage: (value) => set({ leavePage: value }),
}));

export default useFormMasterBahasa;