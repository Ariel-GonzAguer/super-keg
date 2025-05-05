// enrutado
import { useNavigate } from "@arielgonzaguer/michi-router";

// store
import useKegStore from "../store/useKegsStore";
import useAuthStore from "../store/useAuthStore";

// hooks
import { useState } from "react";

export default function Clientes() {
  // estados locales
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // store
  const { clientes, kegsTotales, eliminarCliente } = useKegStore();
  const { user } = useAuthStore();

  // enrutado
  const navigate = useNavigate();

  const handleEliminarCliente = async (nombreCliente: string) => {
    if (!user?.empresa) {
      setMensaje("Error: No se pudo identificar la empresa");
      return;
    }

    if (Object.values(kegsTotales).some(keg => keg.ubicacion === nombreCliente)) {
      setMensaje("No se puede eliminar un cliente que tiene kegs asignados");
      return;
    }

    if (window.confirm(`¿Está seguro que desea eliminar al cliente ${nombreCliente}?`)) {
      setLoading(true);
      try {
        const result = await eliminarCliente(user.empresa, nombreCliente);
        if (result) {
          setMensaje("Cliente eliminado exitosamente");
        } else {
          setMensaje("Error al eliminar el cliente");
        }
      } catch (error) {
        console.error(error);
        setMensaje("Error al eliminar el cliente");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section>
      <p>Esta es la página para ver los clientes y los kegs en sus negocios.</p>
      <p>Para agregar nuevos clientes dirígase a
        <span onClick={() => navigate("/agregar-clientes")}> Agregar Clientes</span>
      </p>

      {mensaje && (
        <p style={{ color: mensaje.includes("Error") ? "red" : "green", margin: "1rem 0" }}>
          {mensaje}
        </p>
      )}

      <div>
        {
          Object.values(clientes).map((cliente, index) => (
            <div key={index} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4>Nombre: {cliente.nombre}</h4>
                <button 
                  onClick={() => handleEliminarCliente(cliente.nombre)}
                  disabled={loading}
                  style={{ 
                    backgroundColor: "#ff4444", 
                    color: "white", 
                    border: "none", 
                    padding: "5px 10px",
                    cursor: loading ? "not-allowed" : "pointer"
                  }}
                >
                  {loading ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
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