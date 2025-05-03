import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";
import useAuthStore from "./store/useAuthStore";
import MichiRouter from "./components/MichiRouter";

function App() {
  const { setUser, user } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
      } else {
        setUser({
          email: user?.email,
          empresa: user?.empresa,
        });
      }
    });

    return () => unsubscribe(); // Limpia el listener al desmontar el componente
  }, [setUser]);

  return <MichiRouter />;
}

export default App;