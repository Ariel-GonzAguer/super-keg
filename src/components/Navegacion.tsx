// enrutado
import { Link } from "@arielgonzaguer/michi-router"


export default function Navegacion({ currentPath }: { currentPath: string }) {

  if (currentPath === "/" || currentPath === "/index") {
    return (
      <div>

      </div>
    )
  }

  return (
    <nav className="sticky top-0 z-10 bg-sky-400 shadow-md ">
      <ul className="flex flex-wrap justify-center sm:justify-between items-center px-2">
        <li className="py-1.5 px-4 text-xl hover:bg-sky-900 hover:text-amber-50 transition-all duration-300 ease-in-out items-center"><Link to="/index">Inicio</Link></li>
        <li className="py-1.5 px-4 text-xl hover:bg-sky-900 hover:text-amber-50 transition-all duration-300 ease-in-out items-center"><Link to="/ver-kegs">Ver Kegs</Link></li>
        <li className="py-1.5 px-4 text-xl hover:bg-sky-900 hover:text-amber-50 transition-all duration-300 ease-in-out items-center"><Link to="/actualizar-kegs">Actualizar Kegs</Link></li>
        <li className="py-1.5 px-4 text-xl hover:bg-sky-900 hover:text-amber-50 transition-all duration-300 ease-in-out items-center"><Link to="/ver-clientes">Clientes</Link></li>
        <li className="py-1.5 px-4 text-xl hover:bg-sky-900 hover:text-amber-50 transition-all duration-300 ease-in-out items-center"><Link to="/agregar-clientes">Agregar Clientes</Link></li>
        <li className="py-1.5 px-4 text-xl hover:bg-sky-900 hover:text-amber-50 transition-all duration-300 ease-in-out items-center"><Link to="/ver-productos">Productos</Link></li>
        <li className="py-1.5 px-4 text-xl hover:bg-sky-900 hover:text-amber-50 transition-all duration-300 ease-in-out items-center"><Link to="/agregar-productos">Agregar Productos</Link></li>
        <li className="py-1.5 px-4 text-xl hover:bg-sky-900 hover:text-amber-50 transition-all duration-300 ease-in-out items-center"><Link to="/reporte">Reporte</Link></li>
      </ul>
    </nav>
  )
}