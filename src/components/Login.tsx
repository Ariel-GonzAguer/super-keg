// hooks
import { useState } from "react";

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

  // store
  const { setUser } = useAuthStore();

  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      setUser({data: user, email: email, empresa: empresa }); // Actualiza el estado del usuario en el store
      console.log("Usuario autenticado:", user);
      navigate("/ver-kegs");
    } catch (error) {
      alert("Error al iniciar sesión. Usuario o contraseña incorrectos.");
      console.error("Error al iniciar sesión: ", error);
    }
  };

  return (
    <section
      style={{ display: "flex", flexDirection: "column", textAlign: "center" }}
    >
      <h1>Login</h1>
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
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </section>
  );
}
