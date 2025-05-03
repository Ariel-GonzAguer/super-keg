import { defineStepper } from "@stepperize/react";

import { useState, useEffect } from "react";

import { EstadosKeg } from "../types/types";

import useKegStore from "../store/useKegsStore";

const { useStepper } = defineStepper(
  { id: "paso-1", title: "Definir estado", description: "Definir estado" },
  { id: "paso-2", title: "Definir última modificación", description: "Definir última modificación" },
  { id: "paso-3", title: "Definir Ubicación", description: "Definir Ubicación" },
  { id: "paso-4", title: "Definir Lote", description: "Definir Lote" },
  { id: "paso-5", title: "Definir Producto", description: "Definir Producto" },
);

export default function ActualizarKegsForm({ setFullKeg, fullKeg }:
  {
    setFullKeg: React.Dispatch<React.SetStateAction<{ estado: EstadosKeg; ultimaModificacion: string; lote: string; producto: string; ubicacion: string }>>,
    fullKeg: {
      estado: EstadosKeg,
      ultimaModificacion: string,
      lote: string,
      producto: string,
      ubicacion: string,
    }
  }) {

  // store
  const { productos, clientes } = useKegStore();

  // estado de los kegs escaneados
  const [estado, setEstado] = useState<EstadosKeg>(fullKeg?.estado || EstadosKeg.LLENO);

  useEffect(() => {
    // Solo sincroniza el estado local si el valor inicial de fullKeg cambia
    setEstado(fullKeg?.estado || EstadosKeg.LLENO);
  }, [fullKeg?.estado]);

  useEffect(() => {
    setEstado(fullKeg?.estado || "");
    console.log("full keg →→:", fullKeg);
  }, [fullKeg]);

  // stepperize
  const methods = useStepper();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement & { name: keyof typeof fullKeg };

    setFullKeg((prev) => {
      // Si el estado no es LLENO, no sobrescribas lote o producto
      if (prev.estado !== EstadosKeg.LLENO && (name === "lote" || name === "producto")) {
        return prev;
      }

      // Actualiza solo el campo específico
      return {
        ...prev,
        [name]: value || prev[name as keyof typeof fullKeg], // Mantén el valor existente si no hay un nuevo valor
      };
    });

    // Si el campo modificado es "estado", actualiza el estado local
    if (name === "estado") {
      setEstado(value as EstadosKeg);
    }
  };

  return (
    <form action="" >
      {methods.when("paso-1", (step) => (
        <>
          <label htmlFor="estado">{step.title}:</label>
          <select
            name="estado"
            id="estado"
            value={estado}
            onChange={handleInputChange}
          >
            <option value={EstadosKeg.LLENO}>Lleno</option>
            <option value={EstadosKeg.LIMPIO}>Limpiado</option>
            <option value={EstadosKeg.ENTREGADO}>Entregado</option>
            <option value={EstadosKeg.EN_MANTENIMIENTO}>En mantenimiento</option>
            <option value={EstadosKeg.RECOGIDO}>Recogido</option>
          </select>
          <button type="button" onClick={methods.next}>Siguiente</button>
          <button type="button" onClick={methods.prev}>Volver</button>
        </>
      ))}
      {methods.when("paso-2", (step) => (
        <>
          <label htmlFor="ultimaModificacion">{step.title}</label>
          <input type="date" id="ultimaModificacion" name="ultimaModificacion" onChange={handleInputChange} />
          <button type="button" onClick={methods.next}>Siguiente</button>
          <button type="button" onClick={methods.prev}>Volver</button>
        </>
      ))}
      {methods.when(["paso-3", estado === "lleno" || estado === "entregado"], (step) => (
        <>
          <label htmlFor="ubicacion">{step.title}</label>
          <select name="ubicacion" id="ubicacion" onChange={handleInputChange} value={fullKeg?.ubicacion || ""}>
            {
              Object.values(clientes).map((cliente, index) => (
                <option key={index} value={cliente.nombre}>{cliente.nombre}</option>
              ))}
          </select>

          <button type="button" onClick={methods.prev}>Volver</button>
        </>
      ))}
      {methods.when(["paso-4", estado === "lleno"], (step) => (
        <>
          <label htmlFor="lote">{step.title}</label>
          <input type="text" id="lote" name="lote" onChange={handleInputChange} />

          <button type="button" onClick={methods.next}>Siguiente</button>
          <button type="button" onClick={methods.prev}>Volver</button>
        </>
      ))}
      {methods.when(["paso-5", estado === "lleno" || estado === "entregado"], (step) => (
        <>
          <label htmlFor="producto">{step.title}</label>
          <select
            name="producto"
            id="producto"
            onChange={handleInputChange}
            value={fullKeg?.producto || ""}
          >
            {Object.values(productos).map((producto, index) => (
              <option key={index} value={typeof producto === 'string' ? producto : JSON.stringify(producto)}>{typeof producto === 'string' ? producto : JSON.stringify(producto)}</option>
            ))}
          </select>

          <button type="button" onClick={methods.next}>Siguiente</button>
          <button type="button" onClick={methods.prev}>Volver</button>
        </>
      ))}

    </form>
  )
}