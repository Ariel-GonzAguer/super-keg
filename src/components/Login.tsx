// hooks
import { useState, useRef } from "react";

// middleware
import { authMiddleware } from "../middleware/authMiddleware";

// firebase - autenticación
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

// enrutado
import { useNavigate } from "@arielgonzaguer/michi-router";

// store
import useAuthStore from "../store/useAuthStore";

export default function Login() {
  // estados locales
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const empresaRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // store
  const { setUser } = useAuthStore();

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const email = emailRef.current?.value || "";
      const password = passwordRef.current?.value || "";
      const empresa = empresaRef.current?.value || "";

      // Lógica de autenticación
      await authMiddleware(
        async () => {
          signInWithEmailAndPassword(auth, email, password)
        },
        empresa,
        email
      );

      // Actualiza el estado del usuario en la store
      setUser({ email, empresa });

      // Redirige a la página principal después de iniciar sesión
      navigate("/index");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <section className="flex flex-col items-center justify-center">
      {error && <div className="text-red-600 m-10 ml-0 mr-0">{error}</div>}
      <form onSubmit={handleLogin} className="flex flex-col items-center w-full max-w-sm">
        <div className="flex flex-col mb-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            ref={emailRef}
            required
            placeholder="Email"
            name="email"
            id="email"
            disabled={loading}
            className="rounded"
          />
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="password" className="pr-2" >Contraseña</label>
          <input
            type="password"
            ref={passwordRef}
            required
            placeholder="Contraseña"
            name="password"
            id="password"
            disabled={loading}
            className="rounded"
          />
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="empresa">Empresa</label>
          <input
            type="text"
            ref={empresaRef}
            required
            placeholder="empresa"
            name="empresa"
            id="empresa"
            className="rounded"
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer w-[30%] hover:bg-sky-600 transition-colors duration-300 ease-in-out">
          {loading ? "Iniciando sesión..." : "Login"}
        </button>
      </form>

      {loading && (
        <h5>Cargando</h5>
      )}
    </section>
  );
}
