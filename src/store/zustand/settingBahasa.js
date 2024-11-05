import { create } from "zustand";

const settingBahasaStore = create((set) => ({
  cancelChange:false,
  submitChange:false,
  setCancelChange:(val)=>set({cancelChange:val}),
  setSubmitChange:(val)=>set({submitChange:val}),
}));

export default settingBahasaStore;