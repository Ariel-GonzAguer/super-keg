// hooks
import { useState } from "react";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // store
  const { setUser } = useAuthStore();

  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
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
    </section>
  );
}
