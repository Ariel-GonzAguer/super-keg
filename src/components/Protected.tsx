import { useEffect } from "react";
import { useNavigate } from "@arielgonzaguer/michi-router";
import useAuthStore from "../store/useAuthStore";
import { ReactNode } from "react";

export default function Protected({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user } = useAuthStore(); // Extrae solo el estado `user` del store

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // ¿ tal vez mostrar un spinner o mensaje de carga ?
  }

  return children;
}
