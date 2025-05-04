import { Link } from "@arielgonzaguer/michi-router"


export default function Index() {

  return (
    <section>
      <ul>
        <li><Link to="/ver-kegs">Ver Kegs</Link></li>
        <li><Link to="/actualizar-kegs">Actualizar Kegs</Link></li>
        <li><Link to="/agregar-data">Agregar Data</Link></li>
        <li><Link to="/reporte">Reporte</Link></li>
      </ul>

    </section>
  )
}