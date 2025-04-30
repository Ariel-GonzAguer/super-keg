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

export interface KegStoreState {
  kegsIDs: string[];
  productos: string[];
  clientes: { nombre: string; kegs: any[] }[];
  agregarIDKegs: (id: string) => void;
  agregarProducto: (producto: string) => void;
  agregarCliente: (cliente: { nombre: string; kegs: any[] }) => void;
  limpiarStore: () => void;
}

interface User {
  data: {};
  email: string;
  empresa: string;
}

export interface AuthStoreState {
  user: User | null;
  setUser: (user: any | null) => void;
  logOut: () => Promise<void>;
}
