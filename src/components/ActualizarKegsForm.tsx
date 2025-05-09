// hooks
import { useRef, useState } from "react";

// componentes
import { defineStepper } from "@stepperize/react";

// tipos
import { EstadosKeg } from "../types/types";

// store
import useKegStore from "../store/useKegsStore";
import useAuthStore from "../store/useAuthStore";

// firebase
import { db } from "../firebase/firebaseConfig";
import { doc, writeBatch, getDoc } from "firebase/firestore";

const { useStepper } = defineStepper(
  { id: "paso-1-DefinirEstado", title: "Definir estado", description: "Definir estado" },
  { id: "paso-2-DefinirÚltimaModificación", title: "Definir última modificación", description: "Definir última modificación" },
  { id: "paso-3-DefinirUbicación", title: "Definir Ubicación", description: "Definir Ubicación" },
  { id: "paso-4-DefinirLote", title: "Definir Lote", description: "Definir Lote" },
  { id: "paso-5-DefinirProducto", title: "Definir Producto", description: "Definir Producto" },
);

export default function ActualizarKegsForm() {
  // store
  const { productos, clientes, IDsKegsEscaneados, limpiarKegsEscaneados } = useKegStore();
  const { fetchDatos } = useKegStore(); // Añadimos fetchDatos

  // estados de los kegs escaneados
  const estadoRef = useRef<EstadosKeg>(EstadosKeg.LLENO);
  const ubicacionRef = useRef<string>("");
  const ultimaModificacionRef = useRef<string>("");
  const loteRef = useRef<string>("");
  const productoRef = useRef<string>("");
  const mensajeRef = useRef<string>("");

  // estado para botón de refrescar
  const [refrescar, setRefrescar] = useState(false);

  // stepperize
  const methods = useStepper();

  // auth store
  const { user } = useAuthStore();

  async function actualizarKegsFireStore() {
    const batch = writeBatch(db);
    if (!user) {
      throw new Error("El usuario no está autenticado.");
    }
    const docRef = doc(db, "clientes", user.empresa);

    try {
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("El documento del cliente no existe.");
      }

      const data = docSnap.data();

      if (!data.kegs) {
        throw new Error("No se encontraron kegs en los datos del cliente.");
      }

      IDsKegsEscaneados.forEach((keg) => {
        const nuevaUbicacion = estadoRef.current === "recogido"
          ? Object.values(clientes).find(cliente => /\(origen\)/i.test(cliente.nombre))?.nombre || "Ubicación no especificada"
          : ubicacionRef.current || data.kegs[keg.id]?.ubicacion || "Ubicación no especificada";

        // Actualizamos directamente usando el ID como clave
        data.kegs[keg.id] = {
          ...data.kegs[keg.id],
          estado: estadoRef.current || data.kegs[keg.id]?.estado,
          ultimaModificacion: ultimaModificacionRef.current || new Date().toISOString(),
          lote: loteRef.current || data.kegs[keg.id]?.lote || "Lote no especificado",
          producto: productoRef.current || data.kegs[keg.id]?.producto || "Producto no especificado",
          ubicacion: nuevaUbicacion,
          id: keg.id // Asegurarnos de mantener el ID
        };
      });

      batch.update(docRef, { kegs: data.kegs });

      await batch.commit();
      // Actualizamos el estado local después de actualizar Firestore
      await fetchDatos(user.empresa, user.email || "");
      mensajeRef.current = "Kegs actualizados correctamente.";
      setRefrescar(!refrescar); // Cambiamos el estado para forzar la actualización del componente
      limpiarKegsEscaneados();
    } catch (err) {
      console.error(err);
      mensajeRef.current = "Error al actualizar los kegs.";
    }
  };

  return (
    <section>
      <form action="" >
        {methods.when("paso-1-DefinirEstado", (step) => (
          <>
            <label htmlFor="estado">{step.title}:</label>
            <select
              name="estado"
              id="estado"
              onChange={(e) => {
                estadoRef.current = e.target.value as EstadosKeg;
              }}
              required
              defaultValue={"Seleccione un estado"}
            >
              <option value={EstadosKeg.LLENO}>Seleccione un estado</option>
              <option value={EstadosKeg.LLENO}>Lleno</option>
              <option value={EstadosKeg.LIMPIO}>Limpio</option>
              <option value={EstadosKeg.ENTREGADO}>Entregado</option>
              <option value={EstadosKeg.EN_MANTENIMIENTO}>En mantenimiento</option>
              <option value={EstadosKeg.RECOGIDO}>Recogido</option>
              <option value={EstadosKeg.SUCIO}>Sucio</option>
            </select>
            <button type="button" onClick={methods.next}>Siguiente</button>
          </>
        ))}

        {methods.when("paso-2-DefinirÚltimaModificación", (step) => (
          <>
            <label htmlFor="ultimaModificacion">{step.title}</label>
            <input type="date" id="ultimaModificacion" name="ultimaModificacion"
              onChange={(e) => { ultimaModificacionRef.current = e.target.value; }}
            />
            <button type="button" onClick={methods.next}>Siguiente</button>
            <button type="button" onClick={methods.prev}>Volver</button>
          </>
        ))}

        {methods.when(["paso-3-DefinirUbicación", estadoRef.current === "lleno" || estadoRef.current === "entregado" || estadoRef.current === "limpio"], (step) => (
          <>
            <label htmlFor="ubicacion">{step.title}</label>
            <select name="ubicacion" id="ubicacion"
              onChange={(e) => { ubicacionRef.current = e.target.value; }}
              required
              defaultValue={"Seleccione una ubicación"}
            >
              <option value="">Seleccione una ubicación</option>
              {
                Object.values(clientes).map((cliente, index) => (
                  <option key={index} value={cliente.nombre}>{cliente.nombre}</option>
                ))}
            </select>

            <button type="button" onClick={methods.next}>Siguiente</button>
            <button type="button" onClick={methods.prev}>Volver</button>
          </>
        ))}

        {methods.when(["paso-4-DefinirLote", estadoRef.current === "lleno"], (step) => (
          <>
            <label htmlFor="lote">{step.title}</label>
            <input type="text" id="lote" name="lote"
              onChange={(e) => { loteRef.current = e.target.value; }} placeholder="Lote" />

            <button type="button" onClick={methods.next}>Siguiente</button>
            <button type="button" onClick={methods.prev}>Volver</button>
          </>
        ))}

        {methods.when(["paso-5-DefinirProducto", estadoRef.current === "lleno" || estadoRef.current === "entregado"], (step) => (
          <>
            <label htmlFor="producto">{step.title}</label>
            <select
              name="producto"
              id="producto"
              onChange={(e) => { productoRef.current = e.target.value; }}
              required
              defaultValue={"Seleccione un producto"}
            >
              <option value="">Seleccione un producto</option>

              {Object.values(productos).map((producto, index) => (
                <option key={index} value={typeof producto === 'string' ? producto : JSON.stringify(producto)}>{typeof producto === 'string' ? producto : JSON.stringify(producto)}</option>
              ))}
            </select>
            <button type="button" onClick={methods.prev}>Volver</button>
          </>
        ))}

      </form>
      <button onClick={actualizarKegsFireStore} disabled={IDsKegsEscaneados.length === 0}>
        Actualizar Firestore
      </button>
      <button onClick={limpiarKegsEscaneados} disabled={IDsKegsEscaneados.length === 0}>{IDsKegsEscaneados.length > 0 ? "Borrar kegs escaneados" : ""}</button>
      {
        refrescar && <button onClick={() => window.location.reload()}>Escanear más kegs</button>
      }
      {mensajeRef.current && <p>{mensajeRef.current}</p>}

    </section>
  )
}