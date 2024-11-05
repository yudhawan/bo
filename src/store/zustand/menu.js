import { create } from "zustand";

const menuZus = create((set) => ({
  menuZ: {},
  setMenuZ: (selected) =>
    set({ menuZ: { id: selected.id, value: selected.value } }),
}));

export default menuZus;
