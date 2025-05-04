// enrutado
import { useNavigate } from "@arielgonzaguer/michi-router";

// store
import useKegStore from "../store/useKegsStore";

export default function Clientes() {
  // store
  const { clientes, kegsTotales } = useKegStore();

  // enrutado
  const navigate = useNavigate();

  return (
    <section>
      <p>Esta es la página para ver los clientes y los kegs en sus negocios.</p>
      <p>Para agregar nuevos clientes dirígase a
        <span onClick={() => navigate("/agregar-clientes")}> Agregar Clientes</span>
      </p>

      <div>
        {
          Object.values(clientes).map((cliente, index) => (
            <div key={index} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
              <h4>Nombre: {cliente.nombre}</h4>
              <p>Kegs en su negocio:</p>
              {Object.values(kegsTotales).some(keg => keg.ubicacion === cliente.nombre) ? (
                <ul>
                  {Object.values(kegsTotales).map((keg, index) => (
                    keg.ubicacion === cliente.nombre &&
                    <li key={index}>
                      <p>ID: {keg.id} </p>
                      {keg.estado === "entregado" && (
                        <>
                          <p>Producto: {keg.producto}</p>
                          <p>Lote: {keg.lote}</p>
                          <p>Fecha de entrega: {keg.ultimaModificacion}</p>
                        </>
                      )}
                      {keg.estado === "lleno" && (
                        <p>Fecha de llenado: {keg.ultimaModificacion}</p>
                      )}
                      {keg.estado === "recogido" && (
                        <p>Fecha de recogida: {keg.ultimaModificacion}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tiene kegs</p>
              )}
            </div>
          ))
        }
      </div>
    </section>
  )
}