import React from "react";
import { useEffect, useRef } from "react";

type GPUViewProps = {
  width: number;
  height: number;
  initFunc: (domElem: HTMLElement, width: number, height: number) => void;
};

const GPUView = ({ width, height, initFunc }: GPUViewProps) => {
  const css = { width: `${width}px`, height: `${height}px` };

  const elemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run the first time this component renders
    initFunc(elemRef.current!, width, height);
  });

  return (
    <div className="gpu-view" style={css}>
      <div className="gpu-view-frame" ref={elemRef}></div>
    </div>
  );
};

export default GPUView;
