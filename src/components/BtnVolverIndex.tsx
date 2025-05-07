import { useNavigate } from "@arielgonzaguer/michi-router";

export default function BtnVolverIndex({ currentPath }: { currentPath: string }) {
  // enrutado
  const navigate = useNavigate();

  // No mostrar el botón si el usuario está en la página de inicio
  if (currentPath === "/index" || currentPath === "/") {
    return null;
  }

  return (
    <button
      onClick={() => navigate("/index")}
      style={{ padding: "1rem", fontFamily: "sans-serif" }}
    >
      <h1>Volver a la página de inicio</h1>
    </button>
  );
}