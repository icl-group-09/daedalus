import React from "react";
import { IGraphicsHandler } from "./IGraphicsHandler";
import { useEffect } from "react";
import {RenderType} from "./RenderType";
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
}: GPUViewProps) => {
  const css = { width: `${width}px`, height: `${height}px` };

  const gpuViewRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
     if (gpuViewRef.current!.children.length === 0) {
      // Run the first time this component renders
      gpuViewRef.current!.appendChild(canvas);
     }
    graphicsHandler.renderPCD(pcdFilename, pcdRenderType, pcdPointSize);
    graphicsHandler.resizeRenderer(width, height);
  });

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
