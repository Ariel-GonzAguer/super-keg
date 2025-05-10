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
      className="border-2 border-black bg-sky-500 px-2 rounded text-white
       hover:bg-red-500 hover:text-black hover:font-bold
       transition-all duration-300 ease-in-out cursor-pointer">
      Cerrar Sesión
    </button>
  )
}