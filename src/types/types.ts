export enum EstadosKeg {
  EN_MANTENIMIENTO = "en_mantenimiento",
  ENTREGADO = "entregado",
  LIMPIO = "limpio",
  LLENO = "lleno",
  RECOGIDO = "recogido",
}

export interface Keg {
  id: string;
  ultimaModificacion: string;
  ubicacion: string;
  estado: EstadosKeg;
  lote?: string;
  producto?: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  kegs: Record<string, Keg>;
}

export interface Producto {
  nombre: string;
}

export interface KegStoreState {
  personaUsuaria: string;
  IDsKegsEscaneados: Keg[];
  productos: Record<string, Producto>;
  clientes: Record<string, Cliente>;
  kegsTotales: Record<string, Keg>;
  agregarIDKegsEscaneados: (keg: { id: string; [key: string]: any }) => void;
  agregarNuevoProducto: (producto: string) => void;
  agregarNuevoCliente: (cliente: { nombre: string; kegs: any[] }) => void;
  limpiarKegsEscaneados: () => void;
  fetchDatos: (empresa: string, email: string) => Promise<void>;
}

interface User {
  email: string;
  empresa: string;
}

export interface AuthStoreState {
  user: User | null;
  setUser: (user: any | null) => void;
  logOut: () => Promise<void>;
}
