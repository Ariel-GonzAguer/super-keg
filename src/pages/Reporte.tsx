// store
import useKegStore from "../store/useKegsStore";
import useAuthStore from "../store/useAuthStore";

// pdf
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  clienteSection: {
    marginBottom: 15,
    padding: 10,
    borderBottom: 1,
    borderBottomColor: '#000000'
  },
  clienteName: {
    fontSize: 18,
    marginBottom: 10
  },
  kegInfo: {
    marginLeft: 20,
    marginBottom: 5
  },
  text: {
    fontSize: 12,
    marginBottom: 3
  }
});

// Componente del PDF
const ReportePDF = () => {
  const { clientes, kegsTotales } = useKegStore();
  const { user } = useAuthStore();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Reporte de Kegs - {user?.empresa}</Text>
        {Object.values(clientes).map((cliente, index) => (
          <View key={index} style={styles.clienteSection}>
            <Text style={styles.clienteName}>Cliente: {cliente.nombre}</Text>
            {Object.values(kegsTotales).some(keg => keg.ubicacion === cliente.nombre) ? (
              Object.values(kegsTotales)
                .filter(keg => keg.ubicacion === cliente.nombre)
                .map((keg, kegIndex) => (
                  <View key={kegIndex} style={styles.kegInfo}>
                    <Text style={styles.text}>ID: {keg.id}</Text>
                    <Text style={styles.text}>Estado: {keg.estado}</Text>
                    {keg.estado === "entregado" && (
                      <>
                        <Text style={styles.text}>Producto: {keg.producto}</Text>
                        <Text style={styles.text}>Lote: {keg.lote}</Text>
                        <Text style={styles.text}>Fecha de entrega: {keg.ultimaModificacion}</Text>
                      </>
                    )}
                    {keg.estado === "lleno" && (
                      <Text style={styles.text}>Fecha de llenado: {keg.ultimaModificacion}</Text>
                    )}
                    {keg.estado === "recogido" && (
                      <Text style={styles.text}>Fecha de recogida: {keg.ultimaModificacion}</Text>
                    )}
                  </View>
                ))
            ) : (
              <Text style={styles.text}>No tiene kegs asignados</Text>
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default function Reporte() {
  const { user } = useAuthStore();
  const currentDate = new Date().toLocaleDateString();

  return (
    <section>
      <h1>Reporte de Kegs</h1>
      <p>Genere y descargue un reporte PDF con todos los clientes y sus kegs asignados.</p>

      <div style={{ marginTop: "2rem" }}>
        <PDFDownloadLink
          document={<ReportePDF />}
          fileName={`reporte-kegs-${user?.empresa}-${currentDate}.pdf`}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {({ loading }) => loading ? 'Generando PDF...' : 'Descargar Reporte PDF'}
        </PDFDownloadLink>
      </div>
    </section>
  )
}