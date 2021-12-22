import React from "react";
import "./App.css";
import { IGraphicsHandler, ThreeHandler } from "./components/gpu/ThreeHandler";
import { useState, createContext, useContext } from "react";
import GPUView from "./components/gpu/GPUView";
import PcdMenu from "./components/menu/PcdMenu";
import Slider from "react-input-slider";
import Upload from "./components/pages/Upload"
import Welcome from "./components/pages/Welcome";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { RenderType } from "./components/gpu/RenderType";

export const EnableGPUContext = createContext(true);

const canvas: HTMLCanvasElement = document.createElement("canvas");

const DUMMY_GRAPHICS_HANDLER: IGraphicsHandler = {
  uploadAsToGTLF: (pcdFilename: string) => {},
  renderPCD: (pcdFilename: string) => "",
  resizeRenderer: (width: number, height: number) => {},
};

function onWindowResize(
  setW: React.Dispatch<React.SetStateAction<number>>,
  setH: React.Dispatch<React.SetStateAction<number>>
) {
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

  const cssControls = {
    position: "absolute",
    width: "100%",
    left: "0px",
    top: "0px",
    color: "white",
  } as const;

  return (
    <Router>
      <div className = "App">
        <div>
          <ul>
            <li>
              <Link to="/">Welcome</Link>
            </li>
            <li>
              <Link to="/upload">Upload</Link>
            </li>
          </ul>
          </div>
     

        <div className = "content">
          <Routes>
            <Route path="/" element={<Welcome/>} />
            <Route path="/upload" element={<Upload/>} />
          </Routes>
        </div>
        <PcdMenu pcd={pcd} setPcd={setPcd} />
        <Slider
          axis="x"
          xmax={0.1}
          xstep={0.0005}
          xmin={0.001}
          x={pointSize}
          onChange={({ x }) => setPointSize(x)}
        />
      </div>
    </Router>
  );
}


export default App;
