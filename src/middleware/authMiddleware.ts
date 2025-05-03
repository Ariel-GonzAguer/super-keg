import useKegStore from "../store/useKegsStore";
import useAuthStore from "../store/useAuthStore";

export const authMiddleware = async (
  authFunction: () => Promise<void>, // Función de autenticación
  empresa: string,
  email: string
) => {
  const { fetchDatos } = useKegStore.getState(); // Accede a la función fetchDatos del store
  const { setUser } = useAuthStore.getState(); // Accede a la función setUser del store
  const user = { email, empresa }; // Crea un objeto de usuario con el email y la empresa

  try {
    // Ejecuta la lógica de autenticación
    await authFunction();

    // Si la autenticación es exitosa, ejecuta fetchDatos
    await fetchDatos(empresa, email);
    // Actualiza el estado del usuario en la store
    setUser(user);
    console.log("Datos cargados correctamente después de la autenticación.");
  } catch (error) {
    console.error("Error en el middleware de autenticación:", error);
  }
};
