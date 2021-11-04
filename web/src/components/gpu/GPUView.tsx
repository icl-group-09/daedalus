import React from "react";
import { IGraphicsHandler } from "./ThreeHandler";
import { useEffect, useRef } from "react";
import {RenderType} from "./RenderType"

type GPUViewProps = {
  width: number;
  height: number;
  graphicsHandler: IGraphicsHandler;
  pcdFilename: string;
  pcdRenderType: RenderType
};

const GPUView = ({
  width,
  height,
  graphicsHandler,
  pcdFilename,
  pcdRenderType
}: GPUViewProps) => {
  const css = { width: `${width}px`, height: `${height}px` };

  const elemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run the first time this component renders
    graphicsHandler.renderPCD(elemRef.current!, pcdFilename, pcdRenderType);
    graphicsHandler.resizeRenderer(width, height);
  });

  return (
    <div className="gpu-view" style={css}>
      <div className="gpu-view-frame" ref={elemRef}></div>
    </div>
  );
};

export default GPUView;
