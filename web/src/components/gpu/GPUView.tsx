import React from "react";
import { useEffect, useRef } from "react";
import { IGraphicsHandler } from "./ThreeHandler";

type GPUViewProps = {
  width: number;
  height: number;
  graphicsHandler: IGraphicsHandler;
};

const GPUView = ({ width, height, graphicsHandler }: GPUViewProps) => {
  const css = { width: `${width}px`, height: `${height}px` };

  const elemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run the first time this component renders
    // and anytime graphicsHandler changes
    graphicsHandler.renderPCD(elemRef.current!);
  }, [graphicsHandler]);

  useEffect(() => {
    // Run the first time this component renders
    // and anytime width, height or graphics handler changes
    graphicsHandler.resizeRenderer(width, height);
  });

  return (
    <div className="gpu-view" style={css}>
      <div className="gpu-view-frame" ref={elemRef}></div>
    </div>
  );
};

export default GPUView;
