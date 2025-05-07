// componentes
import BtnVolverIndex from "../components/BtnVolverIndex";
import Navegacion from "../components/Navegacion";
import Footer from "../components/Footer";

// estilos
import styles from "../styles/BaseLayout.module.css"; // Importar estilos para el layout

export default function BaseLayout({ children }: { children: React.ReactNode }) {

  return (
    <section className={styles.BaseLayout}>
      <Navegacion currentPath={window.location.pathname} />

      <main className="base-layout__content">
        {children}
      </main>

      <BtnVolverIndex currentPath={window.location.pathname} />

      <Footer />
    </section>
  )
}