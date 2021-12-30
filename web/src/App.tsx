import React from "react";
import "./App.css";
// import Upload from "./components/pages/Upload"
import NavBar from "./components/navbar/NavBar";
import GPUView from "./components/gpu/GPUView";
import Sidebar from "./components/sidebar/Sidebar"
import { ThreeHandler } from "./components/gpu/ThreeHandler";
import { RenderType } from "./components/gpu/RenderType";
import { DUMMY_GRAPHICS_HANDLER } from "./components/gpu/IGraphicsHandler";
import {
  BrowserRouter as Router,
  // Routes,
  // Route,
  // Link
} from "react-router-dom";
import { useState, createContext, useContext } from "react";

export const EnableGPUContext = createContext(true);

const canvas: HTMLCanvasElement = document.createElement("canvas");

function onWindowResize(setW: React.Dispatch<React.SetStateAction<number>>, 
  setH: React.Dispatch<React.SetStateAction<number>>) {
  setW(window.innerWidth);
  setH(window.innerHeight);
}

function App() {

  const [pcd, setPcd] = useState("online");
  const [pointSize, setPointSize] = useState(0.003);
  const [w, setW] = useState(window.innerWidth);
  const [h, setH] = useState(window.innerHeight);
  const [r, setR] = useState({X: 0, Y: 0, Z: 0});
  const [pointCloudType, setPointCloudType] = useState(RenderType.PCD);
  window.addEventListener("resize", () => onWindowResize(setW, setH), false);

  const graphicsHandler = !useContext(EnableGPUContext)
    ? DUMMY_GRAPHICS_HANDLER
    : ThreeHandler.getInstance(w, h, canvas);

  return (
    <Router>
     <NavBar pcd={pcd} setPcd={setPcd}></NavBar>
      <div className = "App">
        <Sidebar 
          setPointCloudType={setPointCloudType} 
          r = {r}
          setR={setR} 
          pointSize={pointSize} 
          setPointSize={setPointSize}/> 

        <GPUView
          width={w}
          height={h}
          graphicsHandler={graphicsHandler}
          pcdFilename={pcd}
          pcdRenderType={pointCloudType}
          pcdPointSize={pointSize}
          canvas={canvas}
          rotateDir={r}
        />
      </div>
    </Router>
  );
}


export default App;
