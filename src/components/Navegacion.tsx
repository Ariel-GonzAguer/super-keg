// enrutado
import { Link } from "@arielgonzaguer/michi-router"

// estilos
import styles from "../styles/Navegacion.module.css"


export default function Navegacion() {

  return (
    <nav className={styles.Navegacion}>
      <ul>
        <li><Link to="/index">Inicio</Link></li>
        <li><Link to="/ver-kegs">Ver Kegs</Link></li>
        <li><Link to="/actualizar-kegs">Actualizar Kegs</Link></li>
        <li><Link to="/ver-clientes">Clientes</Link></li>
        <li><Link to="/agregar-clientes">Agregar Clientes</Link></li>
        <li><Link to="/ver-productos">Productos</Link></li>
        <li><Link to="/agregar-productos">Agregar Productos</Link></li>
        <li><Link to="/reporte">Reporte</Link></li>
      </ul>
    </nav>
  )
}