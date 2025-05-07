// componentes
import LogOutButton from "../components/LogOutButton";

// estilos
// import styles from "../styles/Footer.module.css"; // Importar estilos para el layout



export default function Footer() {

  return (
    <footer className="flex flex-row justify-between align-center py-1 px-4 bg-sky-800 text-white border-t-2 border-t-black" >
      <p>Super Keg © 2025 creado por <a href="https://gatorojolab.com" target="_blank" rel="noopener noreferrer">Gato Rojo Lab</a> bajo licencia CC BY-NC-ND 4.0 </p>
      <LogOutButton />

    </footer>
  )
}