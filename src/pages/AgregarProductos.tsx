// hooks
import { useState } from "react";

// store
import useKegStore from "../store/useKegsStore";
import useAuthStore from "../store/useAuthStore";

export default function AgregarProductos() {
  // estados locales
  const [nombreProducto, setNombreProducto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  // store
  const { agregarNuevoProducto } = useKegStore();
  const { user } = useAuthStore();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    if (!user?.empresa) {
      setMensaje("Error: No se pudo identificar la empresa");
      setLoading(false);
      return;
    }

    try {
      const result = await agregarNuevoProducto(user.empresa, {
        nombre: nombreProducto,
      });

      if (result) {
        setMensaje("Cliente creado exitosamente");
        setNombreProducto("");
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
          <label htmlFor="nombre">Nombre del Producto:</label>
          <input
            type="text"
            id="nombre"
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading || !nombreProducto.trim()}>
          {loading ? "Creando..." : "Crear Producto"}
        </button>
      </form>
      {mensaje && <p style={{ color: mensaje.includes("Error") ? "red" : "green", marginTop: "1rem" }}>{mensaje}</p>}
    </section>
  )
}