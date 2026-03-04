import Canvas from "./canvas";
import Preloader from "./components/Preloader";
import Customizer from "./pages/Customizer";

function App() {
  return (
    <main className="relative w-full h-screen overflow-hidden transition-all ease-in bg-[#ECEFEC]">
      <Preloader />
      <Canvas />
      <Customizer />
    </main>
  );
}

export default App;
