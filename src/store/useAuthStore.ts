import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { AuthStoreState } from "../types/types";


const useAuthStore = create<AuthStoreState>()(
  persist(
    immer((set) => ({
      user: null,

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
    {
      name: "useAuthStore", // Nombre del local storage
      partialize: (state) => ({ user: state.user }), // Solo persiste el estado `user`
    }
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
      empresa: "",
    });
  }
});

export default useAuthStore;
