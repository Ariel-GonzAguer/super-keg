// hooks
import { useState } from "react";

// componentes
import QrScanner from "../components/QrScanner";

// firebase
import { db } from "../firebase/firebaseConfig";
import { doc, writeBatch, getDoc } from "firebase/firestore";

// tipos
import { Keg, EstadosKeg } from "../types/types";

// store
import useKegStore from "../store/useKegsStore";
import useAuthStore from "../store/useAuthStore";

function App() {
  // estados locales
  const [mensaje, setMensaje] = useState("");
  const [fullKeg, setFullKeg] = useState<Keg | null>(null);

  // store
  const { IDsKegsEscaneados, productos, clientes, limpiarKegsEscaneados } = useKegStore();
  const { user } = useAuthStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFullKeg((prev) => ({
      ...prev,
      [name]: value || "",
    } as Keg));
  };

  async function actualizarKegs() {
    const batch = writeBatch(db);
    if (!user) {
      throw new Error("El usuario no está autenticado.");
    }
    const docRef = doc(db, "clientes", user.empresa);

    try {
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("El documento del cliente no existe.");
      }

      const data = docSnap.data();

      console.log("Datos a actualizar:", {
        estado: fullKeg?.estado || EstadosKeg,
        ultimaModificacion: fullKeg?.ultimaModificacion || new Date().toISOString(),
        lote: fullKeg?.lote || "Lote no especificado",
        producto: fullKeg?.producto || "Producto no especificado",
        ubicacion: fullKeg?.ubicacion || "Ubicacion no especificada",
      });
      console.log("IDs de kegs a actualizar:", IDsKegsEscaneados);

      IDsKegsEscaneados.forEach((kegID) => {
        const kegIndex = Object.keys(data.kegs).find(
          (key) => data.kegs[key].id === kegID
        );

        if (kegIndex) {
          data.kegs[kegIndex] = {
            ...data.kegs[kegIndex],
            estado: fullKeg?.estado || EstadosKeg,
            ultimaModificacion: fullKeg?.ultimaModificacion || new Date().toISOString(),
            lote: fullKeg?.lote || "Lote no especificado",
            producto: fullKeg?.producto || "Producto no especificado",
            ubicacion: fullKeg?.ubicacion || "Ubicacion no especificada",
          };
        }
      });

      batch.update(docRef, { kegs: data.kegs });

      await batch.commit();
      setMensaje("Kegs actualizados correctamente.");
      limpiarKegsEscaneados();
    } catch (err) {
      console.error(err);
      setMensaje("Error al actualizar los kegs.");
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Escanear Kegs</h1>
      <QrScanner />

      <h2>Escaneados: {IDsKegsEscaneados.length}</h2>
      <ul>
        {IDsKegsEscaneados.map((keg, index) => (
          <li key={index}>ID: {keg}</li>
        ))}
      </ul>

      <form action="" >
        <label htmlFor="estado">Estado:</label>
        <select
          name="estado"
          id="estado"
          onChange={handleInputChange}
        >
          <option value={EstadosKeg.LLENO}>Lleno</option>
          <option value={EstadosKeg.LIMPIO}>Limpiado</option>
          <option value={EstadosKeg.ENTREGADO}>Entregado</option>
          <option value={EstadosKeg.EN_MANTENIMIENTO}>En mantenimiento</option>
          <option value={EstadosKeg.RECOGIDO}>Recogido</option>
        </select>

        <label htmlFor="ultimaModificacion">Última Modificacion:</label>
        <input type="date" id="ultimaModificacion" name="ultimaModificacion" onChange={handleInputChange} />

        <label htmlFor="lote">Lote:</label>
        <input type="text" id="lote" name="lote" onChange={handleInputChange} />

        <label htmlFor="producto">Producto</label>
        <select
          name="producto"
          id="producto"
          onChange={handleInputChange}
        >
          {Object.values(productos).map((producto, index) => (
            <option key={index} value={typeof producto === 'string' ? producto : JSON.stringify(producto)}>{typeof producto === 'string' ? producto : JSON.stringify(producto)}</option>
          ))}
        </select>

        <label htmlFor="ubicacion">Ubicación:</label>
        <select name="ubicacion" id="ubicacion" onChange={handleInputChange}>
          {
            Object.values(clientes).map((cliente, index) => (
              <option key={index} value={cliente.nombre}>{cliente.nombre}</option>
            ))}
        </select>
      </form>

      <button onClick={actualizarKegs} disabled={IDsKegsEscaneados.length === 0}>
        Actualizar Firestore
      </button>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default App;
