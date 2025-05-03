// hooks
// import { useState } from "react";

// componentes
import QrScanner from "../components/QrScanner";
import ActualizarKegsForm from "../components/ActualizarKegsForm";


// store
import useKegStore from "../store/useKegsStore";

function App() {
  // estados locales


  // store
  const { IDsKegsEscaneados } = useKegStore();


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

      <ActualizarKegsForm />

    </div>
  );
}

export default App;
