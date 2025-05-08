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

      agregarNuevoProducto: async (empresa: string, nuevoProducto: Cliente) => {
        try {
          const docRef = doc(db, "clientes", empresa);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const productos = data.productos || {};
            
            // Encontrar el número más alto usado en las claves existentes
            const maxNum = Object.keys(productos)
              .map(key => {
                const match = key.match(/producto-(\d+)/);
                return match ? parseInt(match[1]) : 0;
              })
              .reduce((max, num) => Math.max(max, num), -1);
            
            // Usar el siguiente número disponible
            const nuevaClave = `producto-${maxNum + 1}`;
            
            const productosActualizados = {
              ...productos,
              [nuevaClave]: nuevoProducto.nombre
            };

            await updateDoc(docRef, {
              productos: productosActualizados
            });

            // Actualizar el estado local
            set((state) => {
              state.productos = productosActualizados;
            });

            return true;
          }
          return false;
        } catch (error) {
          console.error("Error al crear producto:", error);
          return false;
        }
      },

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
                nombre: nuevoCliente.nombre,
              },
            };

            await updateDoc(docRef, {
              clientes: clientesActualizados,
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
            const { [nombreCliente]: clienteEliminado, ...clientesRestantes } =
              data.clientes;

            // Actualizar Firestore
            await updateDoc(docRef, {
              clientes: clientesRestantes,
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

      eliminarProducto: async (empresa: string, nombreProducto: string) => {
        try {
          const docRef = doc(db, "clientes", empresa);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const productos = data.productos || {};

            // Encontrar la clave del producto que queremos eliminar
            const productoKey = Object.entries(productos).find(
              ([_, value]) => value === nombreProducto
            )?.[0];

            if (productoKey) {
              const { [productoKey]: _, ...productosRestantes } = productos;

              // Actualizar Firestore
              await updateDoc(docRef, {
                productos: productosRestantes
              });

              // Actualizar el estado local
              set((state) => {
                state.productos = productosRestantes;
              });

              return true;
            }
          }
          return false;
        } catch (error) {
          console.error("Error al eliminar producto:", error);
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
