import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { KegStoreState } from "../types/types";

// importar y agregar tipos correspondientes

const useKegStore = create<KegStoreState>()(
  persist(
    immer((set) => ({
      // estados
      kegsIDs: ["cerverceria-0-id-000"], // array de ids de kegs escaneados
      productos: [], // array de productos
      clientes: [], // array de clientes

      // acciones
      agregarIDKegs: (id: any) =>
        set((state: any) => {
          if (!state.kegsIDs.includes(id)) {
            state.kegsIDs.push(id); // agrega el id al array si no existe
          }
        }),

      agregarProducto: (producto: any) =>
        set((state: any) => {
          if (!state.productos.includes(producto)) {
            state.productos.push(producto); // agrega el producto al array si no existe
          }
        }
      ),

      agregarCliente: (cliente: any) =>
        set((state: any) => {
          if (!state.clientes.includes(cliente)) {
            state.clientes.push(cliente); // agrega el cliente al array si no existe
          }
        }),

      limpiarStore: () =>
        set((state: any) => {
          state.kegsIDs = []; // limpia el array de ids
        }),
    })),
    {
      name: "useKegStore", // Nombre del local storage
      partialize: (state) => ({ kegsIDs: state.kegsIDs }), // Solo persiste el estado `kegsIDs`
    }
  )
);

export default useKegStore;
