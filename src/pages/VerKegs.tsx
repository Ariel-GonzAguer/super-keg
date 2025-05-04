// hooks
// import { useState } from "react";

// estilos


// componentes

// store
import useKegStore from "../store/useKegsStore";
import useAuthStore from "../store/useAuthStore";

export default function VerKegs() {
  // store
  const { kegsTotales } = useKegStore();
  const { user } = useAuthStore();

  return (
    <section>
      <div>
        <h4>Kegs totales de {user?.empresa}</h4>
        {
          Object.values(kegsTotales).map((keg, index) => (
            <div key={index}>
              <p>ID: {keg.id}</p>
              <p>Estado: {keg.estado}</p>
              {keg.estado === "entregado" && (
                <>
                  <p>Producto: {keg.producto}</p>
                  <p>Lote: {keg.lote}</p>
                  <p>Fecha de entrega: {keg.ultimaModificacion}</p>
                </>
              )}
              {
                keg.estado === "lleno" && (
                  <p>Fecha de llenado: {keg.ultimaModificacion}</p>
                )
              }
              {
                keg.estado === "recogido" && (
                  <p>Fecha de recogida: {keg.ultimaModificacion}</p>
                )
              }
              <p>Ubicación: {keg.ubicacion}</p>
            </div>
          ))
        }
      </div>
    </section>
  )
}