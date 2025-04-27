// hooks
import { useEffect, useState } from "react";

// estilos

// componentes

// firebase
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// store
import useAuthStore from "../store/useAuthStore"

export default function VerKegs() {
  // estados locales
  const [nombreUsuario, setNombreUsuario] = useState<string>("");
  const [clientes, setClientes] = useState<any[]>([]); // Cambiado a any[] para manejar JSON
  const [kegs, setKegs] = useState<any[]>([]); // Cambiado a any[] para manejar JSON
  const [productos, setProductos] = useState<any[]>([]); // Cambiado a any[] para manejar JSON

  const { user } = useAuthStore(); // Cambiado a useStore para usar el store de zustand

  useEffect(() => {
    console.log("user", user);
  }, [user]);



  // store

  // funcion de una sola llamada
  async function fetchFullDatos() {
    try {
      const docRef = doc(db, "clientes", user.empresa); // Cambiado a "noBorrar"
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        if (!data) {
          console.error("El documento no contiene datos.");
          return;
        }

        const users = data.users;
        const clientes = data.clientes;
        setClientes(clientes || []); // Cambiado a any[] para manejar JSON
        const kegs = data.kegs;
        setKegs(kegs || []); // Cambiado a any[] para manejar JSON
        const productos = data.productos;
        setProductos(productos || []); // Cambiado a any[] para manejar JSON

        // Verifica si el mapa de usuarios existe
        if (!users) {
          console.log("El documento no contiene un mapa de usuarios.");
          return;
        }

        // Busca el usuario según el correo
        const userKey = Object.keys(users).find(
          (key) => users[key]?.correo === user.email
        );

        if (userKey) {
          const datosUsuario = users[userKey];
          if (datosUsuario?.nombre) {
            setNombreUsuario(
              datosUsuario.nombre.split(" ")[0] // Obtiene el primer nombre
            );
          } else {
            console.log("El usuario no tiene un campo 'nombre'.");
          }
        } else {
          console.log("No se encontró un usuario con el correo proporcionado.");
        }

        console.log("Lectura de datos de Firebase exitosa");
      } else {
        console.log("No existe el documento");
      }
    } catch (error: any) {
      if (error.code === "permission-denied") {
        console.error("Error: Permisos insuficientes para leer el documento.");
      } else {
        console.error("Error fetching document: ", error);
      }
    }
  }

  // useEffect para llamar a la función una sola vez al cargar el componente
  useEffect(() => {
    if (user) {
      fetchFullDatos(); // Llama a la función
    }
  }
    , [user]); // Dependencia para que se ejecute cuando el usuario cambie

  return (
    <section>
      <h2>Ver kegs</h2>
      <h3>Usuario: {nombreUsuario}</h3>
      <div>
        <h4>Clientes</h4>
        {
          clientes.map((cliente, index) => (
            <div key={index}>
              <h4>{cliente.nombre}</h4>
              <p>Ubicación: {cliente.ubicacion}</p>
              <p>Producto: {cliente.producto}</p>
              <p>Lote: {cliente.lote}</p>
              <p>Estado: {cliente.estado}</p>
            </div>
          ))
        }
      </div>
      <div>
        <h4>Kegs</h4>
        {
          kegs.map((keg, index) => (
            <div key={index}>
              <h4>{keg.nombre}</h4>
              <p>Ubicación: {keg.ubicacion}</p>
              <p>Producto: {keg.producto}</p>
              <p>Lote: {keg.lote}</p>
              <p>Estado: {keg.estado}</p>
            </div>
          ))
        }
      </div>

      <div>
        <h4>Productos</h4>
        {
          productos.map((producto, index) => (
            <div key={index}>
              <h4>{producto.nombre}</h4>
              <p>Ubicación: {producto.ubicacion}</p>
              <p>Lote: {producto.lote}</p>
              <p>Estado: {producto.estado}</p>
            </div>
          ))
        }
      </div>
    </section>
  )
}