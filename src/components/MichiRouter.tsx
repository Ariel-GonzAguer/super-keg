// enrutado
import { RouterProvider } from "@arielgonzaguer/michi-router";
import Home from "../pages/Home";
import ActualizarKegs from "../pages/ActualizarKegs";
import VerKegs from "../pages/VerKegs";
import AgregarData from "../pages/AgregarData";
import NotFoud404 from "../components/NotFound404";


// layout
// import BaseLayout from "../layouts/BaseLayout";

const rutas = [
  { path: "/", component: <Home /> },
  { path: "/actualizar-kegs", component: <ActualizarKegs /> },
  { path: "/ver-kegs", component: <VerKegs /> },
  { path: "/agregar-data", component: <AgregarData /> },
];

export default function MichiRouter() {
  return (
    <RouterProvider routes={rutas} /*layout={BaseLayout}*/>
      <NotFoud404 />
    </RouterProvider>
  );
}