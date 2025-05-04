// componentes
import BtnVolverIndex from "../components/BtnVolverIndex";


// estilos

export default function BaseLayout({ children }: { children: React.ReactNode }) {

  return (
    <section>

      {children}

      <BtnVolverIndex currentPath={window.location.pathname} />

    </section>
  )
}