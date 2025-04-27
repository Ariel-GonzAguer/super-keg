import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { AuthState } from "../types/types";

const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: {
      data: null,
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
        state.user = { email: "", empresa: "" };
      });
    },
  }))
);

// Configura el listener de autenticación
onAuthStateChanged(auth, (currentUser) => {
  const setUser = useAuthStore.getState().setUser;
  if (!currentUser) {
    // alert("No hay usuario autenticado");
    setUser(null);
  } else {
    setUser(currentUser);
  }
});

export default useAuthStore;
