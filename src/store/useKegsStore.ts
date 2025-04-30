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
      clientes: [], // array de clientes con sus kegs

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
          // Usar el nombre del cliente como ID
          const clienteId = cliente.nombre;
          const existingCliente = state.clientes.find((c: any) => c.id === clienteId);
          if (!existingCliente) {
            state.clientes.push({
              id: clienteId, // Usar el nombre como ID
              ...cliente,
            });
            console.log(`Cliente agregado: ${cliente.nombre} (ID: ${clienteId})`);
          } else {
            // Actualizar los kegs del cliente existente si es necesario
            existingCliente.kegs = cliente.kegs;
            console.log(`Cliente actualizado: ${cliente.nombre} (ID: ${clienteId})`);
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
