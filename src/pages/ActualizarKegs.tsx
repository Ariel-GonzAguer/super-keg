// hooks
import { useState } from "react";

// componentes
import QrScanner from "../components/QrScanner";
import ActualizarKegsForm from "../components/ActualizarKegsForm";

// firebase
import { db } from "../firebase/firebaseConfig";
import { doc, writeBatch, getDoc } from "firebase/firestore";

// tipos
import { EstadosKeg } from "../types/types";

// store
import useKegStore from "../store/useKegsStore";
import useAuthStore from "../store/useAuthStore";

function App() {
  // estados locales
  const [mensaje, setMensaje] = useState("");
  const [fullKeg, setFullKeg] = useState({
    estado: EstadosKeg.LLENO,
    ultimaModificacion: "",
    lote: "",
    producto: "",
    ubicacion: "",
  });

  // store
  const { IDsKegsEscaneados, limpiarKegsEscaneados } = useKegStore();
  const { user } = useAuthStore();


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
            lote: fullKeg?.estado === EstadosKeg.ENTREGADO ? data.kegs[kegIndex].lote : fullKeg?.lote || "Lote no especificado",
            producto: fullKeg?.estado === EstadosKeg.ENTREGADO ? data.kegs[kegIndex].producto : fullKeg?.producto || "Producto no especificado",
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
          <li key={index}>ID: {keg.id}</li>
        ))}
      </ul>

      <ActualizarKegsForm setFullKeg={setFullKeg} fullKeg={fullKeg} />



      <button onClick={actualizarKegs} disabled={IDsKegsEscaneados.length === 0}>
        Actualizar Firestore
      </button>
      <button onClick={limpiarKegsEscaneados}>Borrar lista</button>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default App;
