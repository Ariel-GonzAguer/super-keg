// hooks
import { use, useEffect } from "react";

// estilos

// enrutado
import { useNavigate } from "@arielgonzaguer/michi-router";

// componentes
import LogOutButton from "../components/LogOutButton";

// store
import useKegStore from "../store/useKegsStore";

export default function VerKegs() {
  // enrutado
  const navigate = useNavigate();
  
  // store
  const { personaUsuaria, productos, clientes, kegsTotales } = useKegStore();
  
  useEffect(() => {
    console.log(productos)
  }, [productos]);

  return (
    <section>
      <LogOutButton />
      <button onClick={() => navigate('/actualizar-kegs')}>Actualizar kegs</button>
      <h2>Data FIRESTORE</h2>
      <h3>Usuario: {personaUsuaria}</h3>
      <div>
        <h4>Clientes</h4>
        {
          Object.values(clientes).map((cliente, index) => (
            <div key={index} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
              <h4>Nombre/ID: {cliente.nombre}</h4>
              <p>Kegs en su negocio:</p>
              <ul>
                {Object.values(cliente.kegs).map((keg, index) => (
                  <li key={index}>
                    <p>ID: {keg.id}</p>
                    <p>Producto: {keg.producto}</p>
                    <p>Entregado: {keg.ultimaModificacion}</p>
                    <p>Lote: {keg.lote}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))
        }
      </div>
      <div>
        <h4>Kegs</h4>
        {
          Object.values(kegsTotales).map((keg, index) => (
            <div key={index}>
              <p>ID: {keg.id}</p>
              <p>Estado: {keg.estado}</p>
              { keg.estado === "entregado" && (
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