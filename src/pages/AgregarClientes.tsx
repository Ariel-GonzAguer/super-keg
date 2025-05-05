// hooks
import { useState } from "react";

// store
import useKegStore from "../store/useKegsStore";
import useAuthStore from "../store/useAuthStore";

// enrutado

export default function AgregarClientes() {
  // estados locales
  const [nombreCliente, setNombreCliente] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  // store
  const { agregarNuevoCliente } = useKegStore();
  const { user } = useAuthStore();

  // enrutado

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    if (!user?.empresa) {
      setMensaje("Error: No se pudo identificar la empresa");
      setLoading(false);
      return;
    }

    try {
      const result = await agregarNuevoCliente(user.empresa, {
        nombre: nombreCliente,
      });

      if (result) {
        setMensaje("Cliente creado exitosamente");
        setNombreCliente("");
      } else {
        setMensaje("Error al crear el cliente");
      }
    } catch (error) {
      setMensaje("Error al crear el cliente");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1>Agregar Clientes</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "300px", margin: "0 auto" }}>
        <div>
          <label htmlFor="nombre">Nombre del Cliente:</label>
          <input
            type="text"
            id="nombre"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading || !nombreCliente.trim()}>
          {loading ? "Creando..." : "Crear Cliente"}
        </button>
      </form>
      {mensaje && <p style={{ color: mensaje.includes("Error") ? "red" : "green", marginTop: "1rem" }}>{mensaje}</p>}
    </section>
  )
}