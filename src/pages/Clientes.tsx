// enrutado
import { useNavigate } from "@arielgonzaguer/michi-router";

// store
import useKegStore from "../store/useKegsStore";
import useAuthStore from "../store/useAuthStore";

// hooks
import { useState } from "react";

// toast - sonner
import { toast, Toaster } from "sonner";

export default function Clientes() {
  // estados locales - ahora usamos un objeto para trackear el loading de cada cliente
  const [loadingClients, setLoadingClients] = useState<Record<string, boolean>>({});

  // store
  const { clientes, kegsTotales, eliminarCliente } = useKegStore();
  const { user } = useAuthStore();

  // enrutado
  const navigate = useNavigate();

  const handleEliminarCliente = async (nombreCliente: string) => {
    if (!user?.empresa) {
      toast.error("Error: No se pudo identificar la empresa");
      return;
    }

    // Evitar eliminación del cliente origen
    if (/\(origen\)/i.test(nombreCliente)) {
      toast.error("No se puede eliminar el cliente origen");
      return;
    }

    if (Object.values(kegsTotales).some(keg => keg.ubicacion === nombreCliente)) {
      toast.error("No se puede eliminar un cliente que tiene kegs asignados");
      return;
    }

    // Actualizar el estado de loading solo para este cliente
    setLoadingClients(prev => ({ ...prev, [nombreCliente]: true }));

    toast.promise(
      async () => {
        try {
          const result = await eliminarCliente(user.empresa, nombreCliente);
          if (!result) {
            throw new Error("Error al eliminar el cliente");
          }
          return result;
        } finally {
          setLoadingClients(prev => ({ ...prev, [nombreCliente]: false }));
        }
      },
      {
        loading: 'Eliminando cliente...',
        success: 'Cliente eliminado exitosamente',
        error: 'Error al eliminar el cliente',
      }
    );
  };

  return (
    <section>
      <Toaster position="top-center" richColors closeButton />
      <p>Esta es la página para ver los clientes y los kegs en sus negocios.</p>
      <p>Para agregar nuevos clientes dirígase a
        <span onClick={() => navigate("/agregar-clientes")}> Agregar Clientes</span>
      </p>

      <div>
        {
          Object.values(clientes).map((cliente, index) => {
            const isLoading = loadingClients[cliente.nombre] || false;

            return (
              <div key={index} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4>Nombre: {cliente.nombre}</h4>
                  <button
                    onClick={() => {
                      toast.custom((t) => (
                        <div style={{ padding: "1rem", background: "white", border: "1px solid #ccc", borderRadius: "4px" }}>
                          <p>¿Está seguro que desea eliminar al cliente {cliente.nombre}?</p>
                          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
                            <button
                              onClick={() => {
                                toast.dismiss(t);
                                handleEliminarCliente(cliente.nombre);
                              }}
                              style={{
                                backgroundColor: "#ff4444",
                                color: "white",
                                border: "none",
                                padding: "5px 10px",
                                cursor: "pointer"
                              }}
                            >
                              Eliminar
                            </button>
                            <button
                              onClick={() => toast.dismiss(t)}
                              style={{
                                backgroundColor: "#666",
                                color: "white",
                                border: "none",
                                padding: "5px 10px",
                                cursor: "pointer"
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ));
                    }}
                    disabled={isLoading}
                    style={{
                      backgroundColor: "#ff4444",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: isLoading ? "not-allowed" : "pointer"
                    }}
                  >
                    {isLoading ? "Eliminando..." : "Eliminar"}
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
            );
          })
        }
      </div>
    </section>
  )
}