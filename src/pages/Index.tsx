// hooks

// estilos


// componentes
import NavegacionIndex from "../components/NavegacionIndex";

// store
import useKegStore from "../store/useKegsStore";


export default function Index() {
  // store
  const { personaUsuaria } = useKegStore();

  return (
    <section className="flex flex-col justify-evenly items-center h-[90vh]">
      <div className="flex justify-center items-center mb-4 text-4xl ">
        <p>Hola de nuevo  </p>
        <p className="animate-tada bg-sky-900 text-amber-50 px-2 rounded ml-1.5">{personaUsuaria}</p>
      </div>

      <p className="text-2xl mb-4">¿Qué vas a hacer hoy?</p>
      <NavegacionIndex />
    </section>
  )
}