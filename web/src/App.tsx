import React from "react";
import "./App.css";
import { IGraphicsHandler, ThreeHandler } from "./components/gpu/ThreeHandler";
import { useState, createContext, useContext } from "react";
import GPUView from "./components/gpu/GPUView";
import PcdMenu from "./components/menu/PcdMenu";

import {RenderType} from "./components/gpu/RenderType"

export const EnableGPUContext = createContext(true);

const dummyGraphicsHandler: IGraphicsHandler = {
  renderPCD: (domElement: HTMLElement, pcdFilename: String) => {},
  resizeRenderer: (width: number, height: number) => {},
};

function App() {
  // These are here just for the demo. Will be removed
  const [pcd, setPcd] = useState("online");
  const [w, setW] = useState(800);
  const [h, setH] = useState(800);
  (window as any).funkyFunc = (x: number, y: number) => {
    setW(x);
    setH(y);
  };

  (window as any).setPcd = (pcdName: string) => {
    setPcd(pcdName);
  };

  const [pointCloudType, setPointCloudType] = useState(RenderType.PCD);

  const ClickPCD = () => {
    setPointCloudType(RenderType.PCD);
  };

  const ClickHM = () => {
    setPointCloudType(RenderType.HM);
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
      <h1>Welcome to Daedalus!</h1>
      <div>
        <button onClick={ClickPCD}>Show Point Cloud</button>
        <button onClick={ClickHM}>Show Heat Map</button>
        <button>Show 2D Map</button>
      </div>
      <PcdMenu pcd={pcd} setPcd={setPcd}/>
      <GPUView
        width={w}
        height={h}
        graphicsHandler={graphicsHandler}
        pcdFilename={pcd}
        pcdRenderType = {pointCloudType}
      />
      
    </div>
  );
}

export default App;
