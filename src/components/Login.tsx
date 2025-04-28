// hooks
import { useState } from "react";

// firebase - autenticación
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

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
      // 1. Primero autenticar al usuario
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user) {
        setError("Error al iniciar sesión");
        return;
      }

      console.log("Usuario autenticado con correo:", user.email);

      // 2. Ahora verificar si tiene acceso al documento de la empresa
      try {
        const userDocRef = doc(db, "clientes", empresa);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          console.log("Documento encontrado en Firestore:", userDoc.data());
          const userData = userDoc.data();
          const userEmails = [
            userData?.users?.administracion?.correo,
            userData?.users?.entregas?.correo,
            userData?.users?.produccion?.correo,
          ].filter(Boolean); // Eliminar valores nulos o undefined

          console.log("Correos permitidos:", userEmails);

          if (userEmails.includes(email)) {
            console.log("Correo del usuario autenticado permitido:", email);
            // Actualizar el estado del usuario en el store
            setUser({ data: user, email: email, empresa: empresa });
            navigate("/ver-kegs");
          } else {
            // Si el correo no está en la lista, cerrar sesión
            await auth.signOut();
            setError("No tienes acceso a esta aplicación con este correo electrónico.");
          }
        } else {
          // Si el documento no existe, cerrar sesión
          await auth.signOut();
          setError("No existe la empresa especificada o no tienes acceso a ella.");
        }
      } catch (firestoreError) {
        console.error("Error al acceder a Firestore:", firestoreError);
        await auth.signOut();
        setError("Error al verificar los permisos en Firestore.");
      }
    } catch (authError: any) {
      console.error("Error al autenticar:", authError);
      setError(authError.message || "Error al iniciar sesión. Verifica tus credenciales.");
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
