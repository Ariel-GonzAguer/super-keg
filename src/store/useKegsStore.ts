import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { KegState } from "../types/types";

// importar y agregar tipos correspondientes

const useKegStore = create<KegState>()(
  //cambiar nombre
  persist(
    immer((set) => ({
      // estados
      kegsIDs: [], // array de ids de kegs escaneados

      // acciones
      agregarIDKegs: (id: any) =>
        set((state: any) => {
          if (!state.kegsIDs.includes(id)) {
            state.kegsIDs.push(id); // agrega el id al array si no existe
          }
        }),

      limpiarStore: () =>
        set((state: any) => {
          state.kegsIDs = []; // limpia el array de ids
        }),
    })),
    { name: "useKegStore" } //Este es el nombre del local storage → cambiar nombre
  )
);

export default useKegStore;
