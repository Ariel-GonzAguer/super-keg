// componentes
import LogOutButton from "../components/LogOutButton";

// estilos
// import styles from "../styles/Footer.module.css"; // Importar estilos para el layout



export default function Footer() {

  return (
    <footer
      className="flex flex-row justify-between align-center py-1 px-4 bg-sky-800 text-white border-t-2 border-t-black" >
      <p className="m-0 sm:flex items-center">Super Keg © 2025 creado por
        <a href="https://gatorojolab.com" target="_blank" rel="noopener noreferrer" className="text-red-600 font-bold hover:text-sky-300 transition-colors duration-300 ease-in-out ml-1 mr-1">
          Gato Rojo Lab
        </a>
        bajo licencia CC BY-NC-ND 4.0 </p>
      <LogOutButton currentPath={window.location.pathname} />

    </footer>
  )
}