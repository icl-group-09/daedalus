import React from "react";
import { IGraphicsHandler } from "./ThreeHandler";
import { useEffect } from "react";
import { RenderType } from "./RenderType";

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
  const updateGLTFAttr = (token: string) => {
    console.log("I was called with token: ", token);
    const fullPath = `http://localhost:5000/get_gltf/${token}.gltf`
    document.getElementById("ar-model")?.setAttribute("gltf-model", fullPath);
  };

  useEffect(() => {
    // Run the first time this component renders
    if (gpuViewRef.current!.children.length === 0) {
      gpuViewRef.current!.appendChild(canvas);
    }
    graphicsHandler.uploadAsToGTLF(
      pcdFilename,
      pcdRenderType,
      pcdPointSize,
      updateGLTFAttr
    );
    // NOTE: I uncommented this line so that the test passes (I could not push)
    graphicsHandler.renderPCD(pcdFilename, pcdRenderType, pcdPointSize);
    // graphicsHandler.resizeRenderer(width, height);
  });

  return (
    <div className="gpu-view" style={css}>
      <div id="gpu-view-frame" ref={gpuViewRef}></div>
    </div>
  );
};

export default GPUView;
