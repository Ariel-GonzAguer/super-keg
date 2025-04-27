import { useState } from "react";
// import QrScanner from "./QrScanner";
import { db } from "../firebase/firebaseConfig";
import { doc, writeBatch } from "firebase/firestore";
import { Keg, EstadosKeg } from "../types/types";

function App() {
  const [kegs, setKegs] = useState<Keg[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [fullKeg, setFullKeg] = useState<Keg | null>(null);


  async function actualizarKegs() {
    const batch = writeBatch(db);

    kegs.forEach(keg => {
      const ref = doc(db, "kegs", String(keg.id));

      batch.set(ref, {
        estado: fullKeg?.estado || EstadosKeg.LLENO,
        fechaLlenado: fullKeg?.fechaLlenado || new Date().toISOString(),
        lote: fullKeg?.lote || "Lote no especificado",
        producto: fullKeg?.producto || "Producto no especificado",
        ubicacion: fullKeg?.ubicacion || "Ubicacion no especificada",
      }, { merge: true });
    });

    try {
      await batch.commit();
      setMensaje("Kegs actualizados correctamente.");
      setKegs([]);
    } catch (err) {
      console.error(err);
      setMensaje("Error al actualizar los kegs.");
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Escanear Kegs</h1>
      {/* <QrScanner onScan={handleScan} /> */}

      <h2>Escaneados: {kegs.length}</h2>
      <ul>
        {kegs.map((keg, idx) => (
          <li key={idx}>ID: {keg.id}</li>
        ))}
      </ul>

      <button onClick={actualizarKegs} disabled={kegs.length === 0}>
        Actualizar Firestore
      </button>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default App;
