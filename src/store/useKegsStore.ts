// zustand
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// firestore
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// tipos
import { KegStoreState } from "../types/types";

// importar y agregar tipos correspondientes

const useKegStore = create<KegStoreState>()(
  persist(
    immer((set) => ({
      // estados
      personaUsuaria: "", // nombre de la persona usuaria
      IDsKegsEscaneados: [
        /*"cerverceria-0-id-000"*/
      ], // array de ids de kegs escaneados
      productos: {}, // objeto de productos
      clientes: {}, // array de clientes con sus kegs
      kegsTotales: {}, // array de kegs totales

      // acciones locales
      agregarIDKegsEscaneados: (id: any) =>
        set((state: any) => {
          if (!state.kegsIDs.includes(id)) {
            state.kegsIDs.push(id); // agrega el id al array si no existe
          }
        }),

      agregarNuevoProducto: (producto: any) =>
        set((state: any) => {
          if (!state.productos.includes(producto)) {
            state.productos.push(producto); // agrega el producto al array si no existe
          }
        }),

      agregarNuevoCliente: (cliente: any) =>
        set((state: any) => {
          // Usar el nombre del cliente como ID
          const clienteId = cliente.nombre;
          const existingCliente = state.clientes.find(
            (c: any) => c.id === clienteId
          );
          if (!existingCliente) {
            state.clientes.push({
              id: clienteId, // Usar el nombre como ID
              ...cliente,
            });
            console.log(
              `Cliente agregado: ${cliente.nombre} (ID: ${clienteId})`
            );
          } else {
            // Actualizar los kegs del cliente existente si es necesario
            existingCliente.kegs = cliente.kegs;
            console.log(
              `Cliente actualizado: ${cliente.nombre} (ID: ${clienteId})`
            );
          }
        }),

      limpiarKegsEscaneados: () =>
        set((state: any) => {
          state.kegsIDs = []; // limpia el array de ids
        }),

      // Función para obtener datos de Firestore y actualizar esta store
      fetchDatos: async (empresa: string, email: string) => {
        try {
          const docRef = doc(db, "clientes", empresa);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            // Procesar clientes
            const clientesMap = data.clientes || {};
            set((state) => {
              state.clientes = clientesMap;
            });

            // Procesar productos
            const productosMap = data.productos || {};
            set((state) => {
              state.productos = productosMap;
            });

            // Procesar kegs totales
            const kegsTotalesMap = data.kegs || {};
            set((state) => {
              state.kegsTotales = kegsTotalesMap;
            });

            // Procesar usuario
            const users = data.users || {};
            const userKey = Object.keys(users).find(
              (key) => users[key]?.correo === email
            );
            if (userKey) {
              const datosUsuario = users[userKey];
              set((state) => {
                state.personaUsuaria = datosUsuario.nombre || "";
              });
            }
          } else {
            console.error("El documento no existe.");
          }
        } catch (error) {
          console.error("Error al obtener datos de Firestore:", error);
        }
      },
    })),
    {
      name: "useKegStore", // Nombre del local storage. Persiste todo el estado.
    }
  )
);

export default useKegStore;
