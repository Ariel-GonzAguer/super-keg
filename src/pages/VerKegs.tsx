// hooks
import { useEffect, useState } from "react";

// estilos

// enrutado
import { useNavigate } from "@arielgonzaguer/michi-router";

// componentes
import LogOutButton from "../components/LogOutButton";

// firebase
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// store
import useAuthStore from "../store/useAuthStore"
import useKegStore from "../store/useKegsStore";

export default function VerKegs() {
  // estados locales
  const [nombreUsuario, setNombreUsuario] = useState<string>("");
  const [kegs, setKegs] = useState<any[]>([]);


  // enrutado
  const navigate = useNavigate();

  // store
  const { user } = useAuthStore();
  const { agregarProducto, agregarCliente, productos, clientes } = useKegStore();

  // funcion de una sola llamada
  async function fetchFullDatos() {
    try {
      if (!user || !user.empresa) {
        console.error("El usuario o la empresa no están definidos.");
        return;
      }
      const docRef = doc(db, "clientes", user.empresa);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        if (!data) {
          console.error("El documento no contiene datos.");
          return;
        }

        const clientesMap = data.clientes;

        if (!clientesMap || typeof clientesMap !== 'object') {
          console.error("El campo 'clientes' no es un objeto válido.");
          return;
        }

        const clientesArray = Object.entries(clientesMap).map(([_, cliente]: [string, any]) => {
          const kegsMap = cliente.kegs || {};
          const kegsArray = Object.entries(kegsMap).map(([kegKey, keg]: [string, any]) => ({
            id: kegKey,
            ...keg,
            cliente: cliente.nombre, // Agregar el nombre del cliente al keg
          }));
          return {

            nombre: cliente.nombre,
            kegs: kegsArray,
          };
        });

        // Actualiza los estados con los datos procesados
        clientesArray.forEach((cliente) => agregarCliente(cliente));
        const allKegs = clientesArray.flatMap((cliente) => cliente.kegs);
        setKegs( allKegs); // Usa el array de kegs del documento o el combinado de todos los clientes

        const productos = data.productos;

        // Asegúrate de que los datos sean arrays antes de renderizarlos
        const productosArray = Array.isArray(productos) ? productos : Object.values(productos || {});

        productosArray.forEach(producto => agregarProducto(producto));

        const users = data.users;
        // Verificamos si el mapa de usuarios existe
        if (!users) {
          console.log("El documento no contiene un mapa de usuarios.");
          return;
        }

        // Busca el usuario según el correo
        const userKey = Object.keys(users).find(
          (key) => user && users[key]?.correo === user.email
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
    if (!user || !user.empresa) {
      return; // Evita ejecutar fetchFullDatos si user o empresa no están definidos
    }
    fetchFullDatos(); // Llama a la función solo cuando user está listo
  }, [user]);

  return (
    <section>
      <LogOutButton />
      <button onClick={() => navigate('/actualizar-kegs')}>Actualizar kegs</button>
      <h2>Ver kegs</h2>
      <h3>Usuario: {nombreUsuario}</h3>
      <div>
        <h4>Clientes</h4>
        {
          clientes.map((cliente, index) => (
            <div key={index} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
              <h4>Nombre/ID: {cliente.nombre}</h4>
              <p>Kegs en su negocio:</p>
              <ul>
                {cliente.kegs.map((keg, index) => (
                  <li key={index}>
                    <p>ID: {keg.id}</p>
                    <p>Producto: {keg.producto}</p>
                    <p>Entregado: {keg.entrega}</p>
                    <p>Lote: {keg.lote}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))
        }
      </div>
      <div>
        <h4>Kegs</h4>
        {
          kegs.map((keg, index) => (
            <div key={index}>
              <p>ID: {keg.id}</p>
              <p>Estado: {keg.estado}</p>
              {keg.estado === "lleno" && (
                <>
                  <p>Producto: {keg.producto}</p>
                  <p>Lote: {keg.lote}</p>
                  <p>Fecha de llenado: {keg.fechaLlenado}</p>
                </>
              )}
              <p>Ubicación: {keg.ubicacion}</p>
              <p>Cliente: {keg.cliente}</p>
            </div>
          ))
        }
      </div>

      <div>
        <h4>Productos</h4>
        {
          productos.map((producto, index) => (
            <div key={index}>
              <p>{producto}</p>
            </div>
          ))
        }
      </div>
    </section>
  )
}