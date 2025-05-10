// hooks
import { useState } from "react";

// store
import useKegStore from "../store/useKegsStore";
import useAuthStore from "../store/useAuthStore";

// firebase
import { db } from "../firebase/firebaseConfig";
import { doc, writeBatch, getDoc } from "firebase/firestore";

// tipos
import { EstadosKeg } from "../types/types";

export default function ActualizarKegsManual() {
  // estados locales
  const [kegId, setKegId] = useState("");
  const [estado, setEstado] = useState<EstadosKeg>(EstadosKeg.LLENO);
  const [ubicacion, setUbicacion] = useState("");
  const [lote, setLote] = useState("");
  const [producto, setProducto] = useState("");
  const [mensaje, setMensaje] = useState("");

  // store
  const { clientes, productos, fetchDatos } = useKegStore();
  const { user } = useAuthStore();

  async function handleActualizarKeg() {
    if (!user) {
      setMensaje("Error: Usuario no autenticado.");
      return;
    }

    const docRef = doc(db, "clientes", user.empresa);
    const batch = writeBatch(db);

    try {
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("El documento del cliente no existe.");
      }

      const data = docSnap.data();

      if (!data.kegs) {
        throw new Error("No se encontraron kegs en los datos del cliente.");
      }

      const nuevaUbicacion =
        estado === "recogido"
          ? Object.values(clientes).find((cliente) =>
            /\(origen\)/i.test(cliente.nombre)
          )?.nombre || "Ubicación no especificada"
          : ubicacion || data.kegs[kegId]?.ubicacion || "Ubicación no especificada";

      // Actualizar el keg en Firestore
      data.kegs[kegId] = {
        ...data.kegs[kegId],
        estado: estado || data.kegs[kegId]?.estado,
        ultimaModificacion: new Date().toISOString(),
        lote: lote || data.kegs[kegId]?.lote || "Lote no especificado",
        producto: producto || data.kegs[kegId]?.producto || "Producto no especificado",
        ubicacion: nuevaUbicacion,
        id: kegId,
      };

      batch.update(docRef, { kegs: data.kegs });
      await batch.commit();

      // Actualizar el estado local
      await fetchDatos(user.empresa, user.email || "");
      setMensaje("Kegs actualizados correctamente.");
      setKegId("");
      setEstado(EstadosKeg.LLENO);
      setUbicacion("");
      setLote("");
      setProducto("");
    } catch (error) {
      console.error(error);
      setMensaje("Error al actualizar el keg.");
    }
  }

  return (
    <section>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleActualizarKeg();
        }}
        className="flex flex-col gap-4 max-w-sm mx-auto"
      >
        <div className="flex flex-col">
          <label htmlFor="kegId">ID del Keg:</label>
          <input
            type="text"
            id="kegId"
            value={kegId}
            onChange={(e) => setKegId(e.target.value)}
            required
            className="text-black bg-blue-100 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="estado">Estado:</label>
          <select
            id="estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value as EstadosKeg)}
            required
            className=" bg-blue-100  text-black rounded"
          >
            <option value={EstadosKeg.LLENO} className="bg-black text-white">Lleno</option>
            <option value={EstadosKeg.LIMPIO} className="bg-black text-white">Limpio</option>
            <option value={EstadosKeg.ENTREGADO} className="bg-black text-white">Entregado</option>
            <option value={EstadosKeg.EN_MANTENIMIENTO} className="bg-black text-white">En mantenimiento</option>
            <option value={EstadosKeg.RECOGIDO} className="bg-black text-white">Recogido</option>
            <option value={EstadosKeg.SUCIO} className="bg-black text-white">Sucio</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="ubicacion">Ubicación:</label>
          <select
            id="ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="bg-blue-100 text-black rounded"
          >
            <option value="">Seleccione una ubicación</option>
            {Object.values(clientes).map((cliente, index) => (
              <option key={index} value={cliente.nombre} className="bg-black text-white">
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="lote">Lote:</label>
          <input
            type="text"
            id="lote"
            value={lote}
            onChange={(e) => setLote(e.target.value)}
            className="text-black bg-blue-100 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="producto">Producto:</label>
            <select
            id="producto"
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            className="bg-blue-100 text-black rounded"
            >
            <option value="" className="bg-black text-white">Seleccione un producto</option>
            {Object.values(productos).map((prod, index) => (
              <option key={index} value={typeof prod === "string" ? prod : JSON.stringify(prod)} className="bg-black text-white">
              {typeof prod === "string" ? prod : JSON.stringify(prod)}
              </option>
            ))}
            </select>
        </div>
        <button type="submit" className="border-2 border-black bg-sky-500 p-2 rounded text-white font-bold
       hover:bg-orange-400 hover:text-black
       transition-all duration-300 ease-in-out cursor-pointer">Actualizar Keg</button>
      </form>
      {mensaje && <p style={{ color: mensaje.includes("Error") ? "red" : "green" }}>{mensaje}</p>}
    </section>
  );
}
