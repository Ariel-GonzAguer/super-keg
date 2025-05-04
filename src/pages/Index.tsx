// hooks

// estilos


// componentes


// store
import useKegStore from "../store/useKegsStore";
import useAuthStore from "../store/useAuthStore";


export default function Index() {
  // store
  const { personaUsuaria } = useKegStore();
  const { user } = useAuthStore();



  return (
    <section style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center", height: "50vh" }}>
      <h1>SUPER KEG</h1>
      <p>Hola de nuevo {personaUsuaria}</p>
      <p>{user?.empresa}</p>

    </section>
  )
}