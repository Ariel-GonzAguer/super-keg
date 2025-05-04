// enrutado
import { RouterProvider } from "@arielgonzaguer/michi-router";

// componentes / páginas
import Home from "../pages/Home";
import Index from "../pages/Index";
import NotFoud404 from "../components/NotFound404";

import ActualizarKegs from "../pages/ActualizarKegs";
import VerKegs from "../pages/VerKegs";

import AgregarClientes from "../pages/AgregarClientes";
import Clientes from "../pages/Clientes";

import AgregarProductos from "../pages/AgregarProductos";
import Productos from "../pages/Productos";

import Reporte from "../pages/Reporte";

// protección de rutas
import Protected from "./Protected";


// layout
import BaseLayout from "../layouts/BaseLayout";

const rutas = [
  { path: "/", component: <Home /> },
  { path: "/index", component: <Protected><Index /></Protected> },
  { path: "/actualizar-kegs", component: <Protected><ActualizarKegs /></Protected> },
  { path: "/ver-kegs", component: <Protected><VerKegs /> </Protected> },
  { path: "/agregar-clientes", component: <Protected><AgregarClientes /></Protected> },
  { path: "/ver-clientes", component: <Protected><Clientes /></Protected> },
  { path: "/agregar-productos", component: <Protected><AgregarProductos /></Protected> },
  { path: "/ver-productos", component: <Protected><Productos /></Protected> },
  { path: "/reporte", component: <Protected><Reporte /></Protected> },
];

export default function MichiRouter() {
  return (
    <RouterProvider routes={rutas} layout={BaseLayout}>
      <NotFoud404 />
    </RouterProvider>
  );
}
