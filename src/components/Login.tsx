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
      navigate("/ver-kegs");
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }



  };

  return (
    <section
      style={{ display: "flex", flexDirection: "column", textAlign: "center" }}
    >
      <h1>Login</h1>
      {error && <div style={{ color: "red", margin: "10px 0" }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            ref={emailRef}
            required
            placeholder="Email"
            name="email"
            id="email"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            ref={passwordRef}
            required
            placeholder="Password"
            name="password"
            id="password"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="empresa">Empresa</label>
          <input
            type="text"
            ref={empresaRef}
            required
            placeholder="empresa"
            name="empresa"
            id="empresa"
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Login"}
        </button>
      </form>

      {loading && (
        <h5>Cargando</h5>
      )}
    </section>
  );
}
