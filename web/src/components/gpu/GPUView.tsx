import React from "react";
import { IGraphicsHandler } from "./ThreeHandler";
import { useEffect, useRef } from "react";

type GPUViewProps = {
  width: number;
  height: number;
  graphicsHandler: IGraphicsHandler;
  pcdFilename: string;
};

const GPUView = ({
  width,
  height,
  graphicsHandler,
  pcdFilename,
}: GPUViewProps) => {
  const css = { width: `${width}px`, height: `${height}px` };

  const elemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run the first time this component renders
    graphicsHandler.renderPCD(elemRef.current!, pcdFilename);
    graphicsHandler.resizeRenderer(width, height);
  });

  return (
    <div className="gpu-view" style={css}>
      <div className="gpu-view-frame" ref={elemRef}></div>
    </div>
  );
};

export default GPUView;
