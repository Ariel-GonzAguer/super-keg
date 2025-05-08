// componentes
import BtnVolverIndex from "../components/BtnVolverIndex";
import Navegacion from "../components/Navegacion";
import Footer from "../components/Footer";

export default function BaseLayout({ children }: { children: React.ReactNode }) {

  return (
    <section className="flex flex-col justify-between min-h-screen">
      <Navegacion currentPath={window.location.pathname} />

      <main className="base-layout__content">
        {children}
      </main>

      <BtnVolverIndex currentPath={window.location.pathname} />

      <Footer />
    </section>
  )
}