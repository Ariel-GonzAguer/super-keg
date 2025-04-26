import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// importar y agregar tipos correspondientes

const useStore = create( //cambiar nombre
  persist(
    immer((set) => ({
      // estados
      count: 0,
   
      // acciones
      increment: () => set((state: any) => {
        state.count += 1;
      }),
    })),
    { name: 'count-storage' } //Este es el nombre del local storage → cambiar nombre
  )
);

export default useStore;