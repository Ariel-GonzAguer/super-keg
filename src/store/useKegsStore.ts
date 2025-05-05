// zustand
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// firestore
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// tipos
import { KegStoreState, Cliente } from "../types/types";

const useKegStore = create<KegStoreState>()(
  persist(
    immer((set) => ({
      // estados
      personaUsuaria: "", // nombre de la persona usuaria
      IDsKegsEscaneados: [], // array de ids de kegs escaneados
      productos: {}, // objeto de productos
      clientes: {}, // array de clientes con sus kegs
      kegsTotales: {}, // array de kegs totales

      // acciones locales
      agregarIDKegsEscaneados: (keg: { id: string; [key: string]: any }) =>
        set((state: any) => {
          if (!state.IDsKegsEscaneados.includes(keg.id)) {
            state.IDsKegsEscaneados.push(keg); // agrega el id al array si no existe
          }
        }),

      agregarNuevoProducto: (producto: any) =>
        set((state: any) => {
          if (!state.productos.includes(producto)) {
            state.productos.push(producto); // agrega el producto al array si no existe
          }
        }),

      limpiarKegsEscaneados: () =>
        set((state: any) => {
          state.IDsKegsEscaneados = []; // limpia el array de ids
        }),

      agregarNuevoCliente: async (empresa: string, nuevoCliente: Cliente) => {
        try {
          const docRef = doc(db, "clientes", empresa);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const clientesActualizados = {
              ...data.clientes,
              [nuevoCliente.nombre]: {
                nombre: nuevoCliente.nombre
              }
            };

            await updateDoc(docRef, {
              clientes: clientesActualizados
            });

            // Actualizar el estado local
            set((state) => {
              state.clientes = clientesActualizados;
            });

            return true;
          }
          return false;
        } catch (error) {
          console.error("Error al crear cliente:", error);
          return false;
        }
      },

      eliminarCliente: async (empresa: string, nombreCliente: string) => {
        try {
          const docRef = doc(db, "clientes", empresa);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const { [nombreCliente]: clienteEliminado, ...clientesRestantes } = data.clientes;

            // Actualizar Firestore
            await updateDoc(docRef, {
              clientes: clientesRestantes
            });

            // Actualizar el estado local
            set((state) => {
              state.clientes = clientesRestantes;
            });

            return true;
          }
          return false;
        } catch (error) {
          console.error("Error al eliminar cliente:", error);
          return false;
        }
      },

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
