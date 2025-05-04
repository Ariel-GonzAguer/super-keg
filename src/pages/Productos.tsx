// store
import useKegStore from "../store/useKegsStore";
import useAuthStore from "../store/useAuthStore";

// enrutado
import { useNavigate } from "@arielgonzaguer/michi-router";

export default function Productos() {
  // store
  const { user } = useAuthStore();
  const { productos } = useKegStore();

  // enrutado
  const navigate = useNavigate();

  return (
    <section>
      <h4>Productos de {user?.empresa}</h4>
      {
        Object.values(productos).map((producto, index) => (
          <div key={index}>
            <p>Nombre: {typeof producto === 'string' ? producto : JSON.stringify(producto)}</p>
          </div>
        ))
      }
      <p>Para agregar nuevos productos dirígase a
        <span onClick={() => navigate("/agregar-productos")}> Agregar Productos</span>
      </p>


    </section>
  )
}