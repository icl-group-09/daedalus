import './GPUView.css'
import React  from "react";
import { IGraphicsHandler } from "./IGraphicsHandler";
import { useEffect, useRef } from "react";
import { RenderType } from "./RenderType";
import { RotationDir } from "./Rotate";

type GPUViewProps = {
  width: number;
  height: number;
  graphicsHandler: IGraphicsHandler;
  pcdFilename: string;
  pcdRenderType: RenderType;
  pcdPointSize: number;
  canvas: HTMLCanvasElement;
  rotateDir: RotationDir;
  isAR: boolean;
  yScale: number;
};

const GPUView = ({
  width,
  height,
  graphicsHandler,
  pcdFilename,
  pcdRenderType,
  pcdPointSize,
  canvas,
  rotateDir,
  isAR,
  yScale
}: GPUViewProps) => {
  const css = { width: `${width}px`, height: `${height}px` };

  const gpuViewRef = React.createRef<HTMLDivElement>();
  const iframe = document.createElement("iframe");
  iframe.setAttribute("src", "/arscene.html")
  iframe.setAttribute("class", "ar-iframe")

  const alreadyStarted = useRef(false)

  useEffect(() => {
      if (gpuViewRef.current!.children.length === 0) {
        // Run the first time this component renders
        gpuViewRef.current!.appendChild(canvas);
       }
      graphicsHandler.renderPCD(pcdFilename, pcdRenderType, pcdPointSize);
      graphicsHandler.resizeRenderer(width, height);
	  graphicsHandler.scaleDepth(yScale);
  }, [canvas, graphicsHandler, pcdFilename, pcdRenderType, pcdPointSize, width, height, yScale, gpuViewRef]);

  useEffect(() => {
    const updateGLTFAttr = (token: string) => {
      sessionStorage.setItem("gltfName", token)
      alreadyStarted.current = false;
      gpuViewRef.current!.appendChild(iframe);
    }
    const currChild = gpuViewRef.current!.children[0];
    gpuViewRef.current!.removeChild(currChild)
    if (!isAR) {
      gpuViewRef.current!.appendChild(canvas);
    } else {
      if (!alreadyStarted.current) {
        graphicsHandler.uploadAsToGTLF(
          pcdFilename,
          pcdRenderType,
          pcdPointSize,
          updateGLTFAttr
        );
      }
    }

  }, [canvas, graphicsHandler, pcdFilename, pcdRenderType, pcdPointSize, isAR, gpuViewRef, iframe, alreadyStarted])

  useEffect(() => {
    graphicsHandler.rotatePCD(rotateDir);
  }, [graphicsHandler, rotateDir]);

  return (
    <div className="gpu-view" style={css}>
      <div id="gpu-view-frame" ref={gpuViewRef}></div>
    </div>
  );
};

export default GPUView;
