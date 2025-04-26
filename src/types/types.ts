export interface Keg {
  estado: string;
  fechaLlenado: string;
  id: string;
  lote: string;
  producto: string;
  ubicacion: string;
}

export enum EstadosKeg {
  EN_MANTENIMIENTO = "en_mantenimiento",
  ENTREGADO = "entregado",
  LIMPIO = "limpio",
  LLENO = "lleno",
  SUCIO = "sucio",
}

export interface KegState {
  kegsIDs: string[]; 
  agregarIDKegs: (id: string) => void;
  limpiarStore: () => void; // Función para limpiar el store
}
