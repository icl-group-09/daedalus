import React from "react";
import { IGraphicsHandler } from "./ThreeHandler";
import { useEffect } from "react";
import {RenderType} from "./RenderType";

type GPUViewProps = {
  width: number;
  height: number;
  graphicsHandler: IGraphicsHandler;
  pcdFilename: string;
  pcdRenderType: RenderType;
  pcdPointSize: number;
  canvas: HTMLCanvasElement;
};

const GPUView = ({
  width,
  height,
  graphicsHandler,
  pcdFilename,
  pcdRenderType,
  pcdPointSize,
  canvas,
}: GPUViewProps) => {
  const css = { width: `${width}px`, height: `${height}px` };

  const gpuViewRef = React.createRef<HTMLDivElement>();
  const updateGLTFAttr = (path: string) => {
    document.getElementById("ar-model")?.setAttribute("gltf-model", path);
  }

  useEffect(() => {
    // Run the first time this component renders
     if (gpuViewRef.current!.children.length === 0) {
       gpuViewRef.current!.appendChild(canvas);
     }
     graphicsHandler.uploadAsToGTLF(pcdFilename, pcdRenderType, pcdPointSize, updateGLTFAttr);
     // graphicsHandler.renderPCD(pcdFilename, pcdRenderType, pcdPointSize);
     // graphicsHandler.resizeRenderer(width, height);
  });

  return (
    <div className="gpu-view" style={css}>
      <div id="gpu-view-frame" ref={gpuViewRef}></div>
    </div>
  );
};

export default GPUView;
