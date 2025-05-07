// hooks
import { useEffect } from "react";

// store - autenticación
import useAuthStore from "../store/useAuthStore";

// enrutado
import { useNavigate } from "@arielgonzaguer/michi-router";


// estilos


// componentes
import Login from "../components/Login";

export default function Home() {
  // estado de autenticación
  const { user } = useAuthStore();

  // enrutado
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.email) {
      if (user.email !== "") {
        navigate("/ver-kegs");
      }
    }
  }, [user, navigate]);

  return (
    <section className="text-center">
      <h1 className="text-3xl pb-4">Super Keg </h1>
      <Login />
    </section>
  )
}