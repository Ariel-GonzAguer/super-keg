import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

import { AuthStoreState } from "../types/types";

const useAuthStore = create<AuthStoreState>()(
  persist(
    immer((set) => ({
      user: {
        email: "",
        empresa: "",
      },

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
    }
  )
);

export default useAuthStore;
