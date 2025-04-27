// enrutado
import { RouterProvider } from "@arielgonzaguer/michi-router";
import Home from "../pages/Home";
import ActualizarKegs from "../pages/ActualizarKegs";
import VerKegs from "../pages/VerKegs";
import AgregarData from "../pages/AgregarData";
import NotFoud404 from "../components/NotFound404";

// protección de rutas
import Protected from "./Protected";


// layout
// import BaseLayout from "../layouts/BaseLayout";

const rutas = [
  { path: "/", component: <Home /> },
  { path: "/actualizar-kegs", component: <Protected><ActualizarKegs /></Protected> },
  { path: "/ver-kegs", component: <Protected><VerKegs /> </Protected> },
  { path: "/agregar-data", component: <Protected><AgregarData /></Protected> },
];

export default function MichiRouter() {
  return (
    <RouterProvider routes={rutas} /*layout={BaseLayout}*/>
      <NotFoud404 />
    </RouterProvider>
  );
}