// enrutado
import { useNavigate } from "@arielgonzaguer/michi-router";
function App() {
  const navigate = useNavigate();


  return (
    <div className="flex flex-col gap-12">
      <button className="border-2 border-black p-0.5 bg-sky-500 px-1 rounded text-white hover:bg-sky-600 transition-colors duration-300 ease-in-out cursor-pointer w-2xl m-[0_auto] text-2xl h-11" onClick={() => navigate("/scanear-kegs")}>Escanear Kegs</button>

      <button className="border-2 border-black p-0.5 bg-sky-500 px-1 rounded text-white hover:bg-sky-600 transition-colors duration-300 ease-in-out cursor-pointer w-2xl m-[0_auto] text-2xl h-11" onClick={() => navigate("/manual-kegs")}>Actualizar Kegs Manualmente</button>
    </div>
  );
}

export default App;
