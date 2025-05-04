// hooks
// import { useState } from "react";

// estilos


// componentes

// store
import useKegStore from "../store/useKegsStore";

export default function VerKegs() {
  // store
  const { personaUsuaria, productos, kegsTotales } = useKegStore();

  return (
    <section>
      <h2>Data FIRESTORE</h2>
      <h3>Usuario: {personaUsuaria}</h3>
      
      <div>
        <h4>Kegs</h4>
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

      <div>
        <h4>Productos</h4>
        {
          Object.values(productos).map((producto, index) => (
            <div key={index}>
              <p>Nombre: {typeof producto === 'string' ? producto : JSON.stringify(producto)}</p>
            </div>
          ))
        }
      </div>
    </section>
  )
}