import useKegStore from "../store/useKegsStore";

export const authMiddleware = async (
  authFunction: () => Promise<void>, // Función de autenticación
  empresa: string,
  email: string
) => {
  const { fetchDatos } = useKegStore.getState(); // Accede a la función fetchDatos del store

  try {
    // Ejecuta la lógica de autenticación
    await authFunction();

    // Si la autenticación es exitosa, ejecuta fetchDatos
    await fetchDatos(empresa, email);
    console.log("Datos cargados correctamente después de la autenticación.");
  } catch (error) {
    console.error("Error en el middleware de autenticación:", error);
  }
};
