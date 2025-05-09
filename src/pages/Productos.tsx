// store
import useKegStore from "../store/useKegsStore";
import useAuthStore from "../store/useAuthStore";

// enrutado
import { useNavigate } from "@arielgonzaguer/michi-router";

// hooks
import { useState } from "react";

// toast
import { toast, Toaster } from "sonner";

export default function Productos() {
  // estados locales - ahora usamos un objeto para trackear el loading de cada producto
  const [loadingProducts, setLoadingProducts] = useState<Record<string, boolean>>({});

  // store
  const { user } = useAuthStore();
  const { productos, eliminarProducto, kegsTotales } = useKegStore();

  // enrutado
  const navigate = useNavigate();

  const handleEliminarProducto = async (nombreProducto: string) => {
    if (!user?.empresa) {
      toast.error("Error: No se pudo identificar la empresa");
      return;
    }

    // Verificar si hay kegs usando este producto
    if (Object.values(kegsTotales).some(keg => keg.producto === nombreProducto)) {
      toast.error("No se puede eliminar un producto que está siendo usado en kegs");
      return;
    }

    // Actualizar el estado de loading solo para este producto
    setLoadingProducts(prev => ({ ...prev, [nombreProducto]: true }));

    toast.promise(
      async () => {
        try {
          const result = await eliminarProducto(user.empresa, nombreProducto);
          if (!result) {
            throw new Error("Error al eliminar el producto");
          }
          return result;
        } finally {
          setLoadingProducts(prev => ({ ...prev, [nombreProducto]: false }));
        }
      },
      {
        loading: 'Eliminando producto...',
        success: 'Producto eliminado exitosamente',
        error: 'Error al eliminar el producto',
      }
    );
  };

  return (
    <section>
      <Toaster position="top-center" richColors closeButton />
      <h4>Productos de {user?.empresa}</h4>
      {
        Object.values(productos).map((producto, index) => {
          const nombreProd = typeof producto === 'string' ? producto : producto.nombre;
          const isLoading = loadingProducts[nombreProd] || false;

          return (
            <div key={index} style={{ border: "1px solid black", margin: "10px", padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p>Nombre: {nombreProd}</p>
              <button
                onClick={() => {
                  toast.custom((t) => (
                    <div style={{ padding: "1rem", background: "white", border: "1px solid #ccc", borderRadius: "4px" }}>
                      <p>¿Está seguro que desea eliminar el producto {nombreProd}?</p>
                      <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
                        <button
                          onClick={() => {
                            toast.dismiss(t);
                            handleEliminarProducto(nombreProd);
                          }}
                          style={{
                            backgroundColor: "#ff4444",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            cursor: "pointer"
                          }}
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={() => toast.dismiss(t)}
                          style={{
                            backgroundColor: "#666",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            cursor: "pointer"
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ));
                }}
                disabled={isLoading}
                style={{
                  backgroundColor: "#ff4444",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: isLoading ? "not-allowed" : "pointer"
                }}
              >
                {isLoading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          );
        })
      }
      <p>Para agregar nuevos productos dirígase a
        <span onClick={() => navigate("/agregar-productos")}> Agregar Productos</span>
      </p>
    </section>
  )
}