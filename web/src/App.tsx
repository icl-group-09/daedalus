import React, { useRef } from "react";
import "./App.css";
import NavBar from "./components/navbar/NavBar";
import GPUView from "./components/gpu/GPUView";
import Sidebar from "./components/sidebar/Sidebar"
import { ThreeHandler } from "./components/gpu/ThreeHandler";
import { RenderType } from "./components/gpu/RenderType";
import { DUMMY_GRAPHICS_HANDLER } from "./components/gpu/IGraphicsHandler";
import { useState, useEffect, createContext, useContext } from "react";
import Upload from "./components/upload/Upload";
import About from "./components/about/About";

const canvas: HTMLCanvasElement = document.createElement("canvas");

function onWindowResize(setW: React.Dispatch<React.SetStateAction<number>>, 
  setH: React.Dispatch<React.SetStateAction<number>>) {
  setW(window.innerWidth);
  setH(window.innerHeight);
}

const DUMMY_FETCH = ((input: RequestInfo, init?: RequestInit | undefined) => 
    new Promise<Response>((resolve, reject) => {}));

export const EnableGPUContext = createContext(true);

function App() {

  const [pcd, setPcd] = useState("online");
  const [pointSize, setPointSize] = useState(0.003);
  const [w, setW] = useState(window.innerWidth);
  const [h, setH] = useState(window.innerHeight);
  const [r, setR] = useState({X: 0, Y: 0, Z: 0});
  const [yScale, setyScale] = useState(1)
  const [pointCloudType, setPointCloudType] = useState(RenderType.PCD);
  const [isAR, setIsAR] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [pcdList, setPcdList] = useState<string[]>([]);

  window.addEventListener("resize", () => onWindowResize(setW, setH), false);

  const changePCD = (newPCD: string) => {
    setPcd(newPCD);
    setR({X: 0, Y: 0, Z: 0});
    setPointCloudType(RenderType.PCD);
    setPointSize(0.003);
	setyScale(1);
  }

  const graphicsHandler = !useContext(EnableGPUContext)
    ? DUMMY_GRAPHICS_HANDLER
    : ThreeHandler.getInstance(w, h, canvas);
  
  const fetchFunc = !useContext(EnableGPUContext)
   ? DUMMY_FETCH
   : fetch

  const fetchPCDList = useRef(() => {
    fetchFunc(`/getFileNames`,
      {
        method: 'GET',
        headers: { accept: "application/json" }
      }).then((response) => response.json())
      .then((json_names)=> {
        var names = json_names["body"]
          .split(",")
          .filter((name : string) => {return name.endsWith(".pcd")})
          .map((name : string) => {return name.replace(/\.[^/.]+$/, "")})
         setPcdList(names)
      }).catch((error) => {
          console.log('Error: ', error)
      })
  })

  useEffect(() => {
    fetchPCDList.current();
   }, [fetchPCDList])

  return (
    <div>
     <NavBar 
        pcd={pcd} 
        changePCD={changePCD} 
        setShowUpload={setShowUpload} 
        setShowAbout={setShowAbout}
        setIsAR={setIsAR}
        isAR={isAR}
        pcdList={pcdList}
        />

     <Upload cb={fetchPCDList.current} show={showUpload} setShowUpload={setShowUpload}/> 
     <About show={showAbout} setShowAbout={setShowAbout}/> 
      <div className = "App">
        <Sidebar 
          pointCloudType={pointCloudType}
          setPointCloudType={setPointCloudType} 
          r = {r}
          setR={setR} 
          pointSize={pointSize} 
          setPointSize={setPointSize}
          disabled={isAR} 
		  yScale={yScale}
		  setyScale={setyScale}
          /> 

        <GPUView
          width={w}
          height={h}
          graphicsHandler={graphicsHandler}
          pcdFilename={pcd}
          pcdRenderType={pointCloudType}
          pcdPointSize={pointSize}
          canvas={canvas}
          rotateDir={r}
          isAR={isAR}
		  yScale={yScale}
        />
      </div>
    </div>
  );
}


export default App;
