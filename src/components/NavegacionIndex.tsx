// enrutado
import { Link } from "@arielgonzaguer/michi-router"

export default function NavegacionIndex() {
  return (
    <nav className="border-black border-4 w-[80%] max-w-2xs sm:w-[50%] rounded animate-slide-in-bottom  animate-duration-slower">
      <ul className="flex flex-col flex-wrap justify-center sm:justify-between items-center text-center">
        <li className="w-full text-xl">
          <Link to="/ver-kegs" className="block w-full py-1.5 px-4 hover:bg-sky-900 hover:text-amber-50 transition-all duration-300 ease-in-out">Ver Kegs</Link>
        </li>
        <li className="w-full text-xl">
          <Link to="/actualizar-kegs" className="block w-full py-1.5 hover:bg-sky-900 hover:text-amber-50 transition-all duration-300 ease-in-out">Actualizar Kegs</Link>
        </li>
        <li className="w-full text-xl">
          <Link to="/ver-clientes" className="block w-full py-1.5 hover:bg-sky-900 hover:text-amber-50 transition-all duration-300 ease-in-out">Clientes</Link>
        </li>
        <li className="w-full text-xl">
          <Link to="/agregar-clientes" className="block w-full py-1.5 hover:bg-sky-900 hover:text-amber-50 transition-all duration-300 ease-in-out">Agregar Clientes</Link>
        </li>
        <li className="w-full text-xl">
          <Link to="/ver-productos" className="block w-full py-1.5 hover:bg-sky-900 hover:text-amber-50 transition-all duration-300 ease-in-out">Productos</Link>
        </li>
        <li className="w-full text-xl">
          <Link to="/agregar-productos" className="block w-full py-1.5 hover:bg-sky-900 hover:text-amber-50 transition-all duration-300 ease-in-out">Agregar Productos</Link>
        </li>
        <li className="w-full text-xl">
          <Link to="/reporte" className="block w-full py-1.5 hover:bg-sky-900 hover:text-amber-50 transition-all duration-300 ease-in-out">Reporte</Link>
        </li>
      </ul>
    </nav>
  )
}