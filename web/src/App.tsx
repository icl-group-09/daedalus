
import "./App.css"
import React from "react";
import { IGraphicsHandler, ThreeHandler } from "./components/gpu/ThreeHandler";
import { useState, createContext, useContext } from "react";
import GPUView from "./components/gpu/GPUView";

export const EnableGPUContext = createContext(true);

const dummyGraphicsHandler: IGraphicsHandler = {
  renderPCD: (domElement: HTMLElement, pcdFilename: String) => {},
  resizeRenderer: (width: number, height: number) => {},
};

function App() {
  // These are here just for the demo. Will be removed
  const [pcd, setPcd] = useState("personFront");
  const [w, setW] = useState(800);
  const [h, setH] = useState(800);
  (window as any).funkyFunc = (x: number, y: number) => {
    setW(x);
    setH(y);
  };

  (window as any).setPcd = (pcdName: string) => {
    setPcd(pcdName);
  };

  const [showPointCloud, setShowPointCloud] = useState(true);

  const handleClick = () => {
    setShowPointCloud(!showPointCloud);
  };

  const cssCenter = {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  } as const;

  const graphicsHandler = !useContext(EnableGPUContext)
    ? dummyGraphicsHandler
    : new ThreeHandler(w, h);

  return (
    <div className="App" style={cssCenter}>

      <HelloWorld />
      <h1>Welcome to Daedalus!</h1>
      <div>
      <button onClick={handleClick}>Show Point Cloud</button>
      <button>Show Heat Map</button>
      <button>Show 2D Map</button>
      </div>
      {showPointCloud &&
      <GPUView
        width={w}
        height={h}
        graphicsHandler={graphicsHandler}
        pcdFilename={pcd} />
    }
    
    </div>
  );
}

export default App;
