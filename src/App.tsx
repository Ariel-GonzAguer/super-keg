// hooks

// estilos

// componentes
import QRScanner from "./components/QrScanner"
import useKegStore from "../src/store/useKegsStore";




export default function App() {
  const { kegsIDs } = useKegStore(); // Cambiado a useStore para usar el store de zustand


  return (
    <section>
      <h1>Super Keg</h1>
      <h2>Escanea el código QR</h2>
      <QRScanner />

      <h2>Códigos QR</h2>
      <div>
        <ul>
          {kegsIDs.map((code: any, index: number) => (
            <li key={index}>
              {code}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}