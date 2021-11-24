import React from "react";
import "./App.css";
import { IGraphicsHandler, ThreeHandler } from "./components/gpu/ThreeHandler";
import { useState, createContext, useContext } from "react";
import GPUView from "./components/gpu/GPUView";
import PcdMenu from "./components/menu/PcdMenu";
import Slider from "react-input-slider";

import { RenderType } from "./components/gpu/RenderType";

export const EnableGPUContext = createContext(true);

const INITAL_HEIGHT = 800;
const INITAL_WIDTH = 800;

const canvas: HTMLCanvasElement = document.createElement("canvas");

const DUMMY_GRAPHICS_HANDLER: IGraphicsHandler = {
  renderPCD: (pcdFilename: String) => {},
  resizeRenderer: (width: number, height: number) => {},
};

function onWindowResize(setW: React.Dispatch<React.SetStateAction<number>>, 
  setH: React.Dispatch<React.SetStateAction<number>>) {
  setW(window.innerWidth);
  setH(window.innerHeight);
}

function App() {
  // These are here just for the demo. Will be removed
  const [pcd, setPcd] = useState("online");
  const [pointSize, setPointSize] = useState(0.003);
  const [w, setW] = useState(window.innerWidth);
  const [h, setH] = useState(window.innerHeight);
  window.addEventListener("resize", () => onWindowResize(setW, setH), false);

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

  const graphicsHandler = !useContext(EnableGPUContext)
    ? DUMMY_GRAPHICS_HANDLER
    : ThreeHandler.getInstance(w, h, canvas);

  const cssCenter = {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  } as const;

  return (
    <div className="App" style={cssCenter}>
      <h1>Welcome to Daedalus!</h1>
      <div>
        <button onClick={ClickPCD}>Show Point Cloud</button>
        <button onClick={ClickHM}>Show Heat Map</button>
        <button>Show 2D Map</button>
      </div>
      <div>
        <PcdMenu pcd={pcd} setPcd={setPcd}/>
          <Slider
            axis="x"
            xmax={0.1}
            xstep={0.0005}
            xmin={0.001}
            x={pointSize}
            onChange={({ x }) => setPointSize(x)}
          />
      </div>

      <GPUView
        width={w}
        height={h}
        graphicsHandler={graphicsHandler}
        pcdFilename={pcd}
        pcdRenderType={pointCloudType}
        pcdPointSize={pointSize}
        canvas={canvas}
      />
    </div>
  );
}

export default App;
