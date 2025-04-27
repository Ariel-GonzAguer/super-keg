import { logOut } from "../firebase/firebaseConfig";
import { useNavigate } from "@arielgonzaguer/michi-router";
export default function LogOutButton() {
  const navigate = useNavigate();

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
    <button onClick={handleLogOut}>Cerrar Sesión</button>
  )
}