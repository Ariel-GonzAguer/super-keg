import { logOut } from "../firebase/firebaseConfig";
import { useNavigate } from "@arielgonzaguer/michi-router";

export default function LogOutButton({ currentPath }: { currentPath: string }) {
  const navigate = useNavigate();

  if (currentPath === "/") {
    return null;
  }

  async function handleLogOut() {
    try {
      await logOut();
      navigate("/"); // Redirige a la página de inicio después de cerrar sesión
    } catch (error) {
      alert(
        `Parece que hubo un error al cerrar sesión 😔.`
      );
    }
  }


  return (
    <button onClick={handleLogOut}
      className="border-2 border-black p-0.5 bg-sky-500 px-1 rounded text-white hover:bg-sky-600 transition-colors duration-300 ease-in-out cursor-pointer">
      Cerrar Sesión
    </button>
  )
}