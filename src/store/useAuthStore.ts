import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { AuthState } from "../types/types"; // Asegúrate de que la ruta sea correcta


const useAuthStore = create<AuthState>()(
  persist(
    immer((set) => ({
      user: null, // Inicializado como null
      setUser: (user) =>
        set((state) => {
          state.user = user;
        }),
      logOut: async () => {
        await signOut(auth);
        set((state) => {
          state.user = null; // Restablece a null al cerrar sesión
        });
      },
    })),
    { name: "useAuthStore" } // Este es el nombre del local storage
  )
);

// Configura el listener de autenticación
onAuthStateChanged(auth, (currentUser) => {
  const setUser = useAuthStore.getState().setUser;
  if (!currentUser) {
    setUser(null);
  } else {
    setUser({
      data: {},
      email: currentUser.email || "",
      empresa: "", // Ajusta según los datos disponibles
    });
  }
});

export default useAuthStore;
