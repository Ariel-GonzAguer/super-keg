// hooks
import { useState } from "react";

// estilos
import styles from "../styles/QrScanner.module.css";

// componentes
import { Scanner } from '@yudiel/react-qr-scanner';

// store
import useKegStore from "../store/useKegsStore";

export default function QRScanner() {
  // estados locales
  const [error, setError] = useState<string | null>(null);

  // store
  const { agregarIDKegs } = useKegStore(); // Cambiado a useStore para usar el store de zustand

  return (
    <section className={styles.QRScanner}>
      <Scanner
        onScan={(qrCode) => {
          if (qrCode) {
            try {
              const parsedData = JSON.parse(qrCode[0]?.rawValue || ""); // Analiza el JSON del QR
              const idKeg = parsedData.id;
              agregarIDKegs(idKeg); // Agrega el ID al store
              console.log(idKeg);
            } catch (e) {
              setError("El QR no contiene un JSON válido");
              console.error("Error al analizar el JSON del QR", e);
            }
          } else {
            setError("No se encontró un código QR");
            console.error("No se encontró un código QR", error);
          }
        }}
        onError={(error: any) => {
          setError(error.message);
          console.error("Error al escanear el código QR", error);
        }}
        allowMultiple={false}
      />
    </section>
  );
}