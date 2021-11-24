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

  useEffect(() => {
    // Run the first time this component renders
    graphicsHandler.renderPCD(pcdFilename, pcdRenderType, pcdPointSize);
    graphicsHandler.resizeRenderer(width, height);

    const gpuFrame = document.getElementById("gpu-view-frame");
    if (gpuFrame?.children.length === 0) {
      gpuFrame.appendChild(canvas);
    }
  });

  return (
    <div className="gpu-view" style={css}>
      <div id="gpu-view-frame"></div>
    </div>
  );
};

export default GPUView;
