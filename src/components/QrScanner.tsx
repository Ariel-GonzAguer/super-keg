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
  const { agregarIDKegsEscaneados, kegsTotales } = useKegStore(); 

  return (
    <section className={styles.QRScanner}>
      <Scanner
        onScan={(qrCode) => {
          if (qrCode) {
            try {
              const parsedData = JSON.parse(qrCode[0]?.rawValue || ""); // Analiza el JSON del QR
              const idKeg = parsedData.id;

              // Busca el keg en el estado de kegsTotales
              const keg = Object.values(kegsTotales).find((keg) => keg.id === idKeg); // Busca el objeto por su ID

              if (keg) {
                agregarIDKegsEscaneados(keg); // Agrega el objeto del keg al store
              } else {
                setError("El keg no existe en el estado de kegs totales.");
                alert("El keg no existe en el estado de kegs totales.");
              }
            } catch (e) {
              setError("El QR no contiene un JSON válido");
              alert(`El QR no contiene un JSON válido → ${e}`);
            }
          } else {
            setError("No se encontró un código QR");
            alert(`No se encontró un código QR → ${error}`);
          }
        }}
        onError={(error: any) => {
          setError(error.message);
          alert(`Error al escanear el código QR → ${error.message}`);
        }}
        allowMultiple={false}
      />
    </section>
  );
}