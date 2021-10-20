import { useState, useEffect, createContext } from "react";
import GPUView from "./components/gpu/GPUView";

export const EnableGPUContext = createContext(true);

function App() {
  // These are here just for the demo. Will be removed
  const [w, setW] = useState(800);
  const [h, setH] = useState(800);
  (window as any).funkyFunc = (x: number, y: number) => {
    setW(x);
    setH(y);
  };

  const cssCenter = {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  } as const;

  useEffect(() => {});

  return (
    <div className="App" style={cssCenter}>
      <h1>Welcome to Daedalus!</h1>
      <GPUView height={h} width={w} />
    </div>
  );
}

export default App;
