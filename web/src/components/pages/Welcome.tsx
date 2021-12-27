import React from "react";
import { useState, createContext, useContext } from "react";
import { IGraphicsHandler, ThreeHandler } from "../gpu/ThreeHandler";
import GPUView from "../gpu/GPUView";
import PcdMenu from "../menu/PcdMenu";
import Slider from "react-input-slider";
import { RenderType } from "../gpu/RenderType";
import { RotationDir } from "../gpu/Rotate";

export const EnableGPUContext = createContext(true);

const canvas: HTMLCanvasElement = document.createElement("canvas");

const DUMMY_GRAPHICS_HANDLER: IGraphicsHandler = {
  renderPCD: (pcdFilename: String) => {},
  resizeRenderer: (width: number, height: number) => {},
  rotatePCD: (rotateDir: RotationDir) => {},
};

function onWindowResize(setW: React.Dispatch<React.SetStateAction<number>>, 
  setH: React.Dispatch<React.SetStateAction<number>>) {
  setW(window.innerWidth);
  setH(window.innerHeight);
}

function Welcome(){

    // These are here just for the demo. Will be removed
    const [pcd, setPcd] = useState("online");
    const [pointSize, setPointSize] = useState(0.003);
    const [w, setW] = useState(window.innerWidth);
    const [h, setH] = useState(window.innerHeight);
    const [r, setR] = useState({X: 0, Y: 0, Z: 0});
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

    const rotateX = () => {
      setR({X: Math.PI/2, Y: 0, Z: 0})
    }

    const rotateXBack = () => {
      setR({X: -Math.PI/2, Y: 0, Z: 0})
    }

    const rotateY = () => {
      setR( {X: 0, Y: Math.PI/2, Z: 0})
    }

    const rotateYBack = () => {
      setR( {X: 0, Y: -Math.PI/2, Z: 0})
    }
  
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
      width: "30%",
      left: "0px",
      top: "50px",
      color: "white"
    } as const;
  
  
    return (
  
      <div className="App" style={cssCenter}>
        <div className = "controls" style={cssControls}>
          <h1>Welcome to Daedalus!</h1>
          <div>
            <button onClick={ClickPCD}>Show Point Cloud</button>
            <button onClick={ClickHM}>Show Heat Map</button>
            <button>Show 2D Map</button>
          </div>
          <div>
            <button onClick={rotateX}>Rotate PCD X</button>
            <button onClick={rotateXBack}>Rotate PCD X Back</button>
            <button onClick={rotateY}>Rotate PCD Y</button>
            <button onClick={rotateYBack}>Rotate PCD Y Back</button>
          </div>
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
          rotateDir={r}
        />
      </div>
    );
 
 }

 export default Welcome;