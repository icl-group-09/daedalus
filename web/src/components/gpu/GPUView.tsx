import { useEffect, useRef, useContext } from "react";
import { EnableGPUContext } from "../../App";
import { init } from "./ThreeHandler";

type GPUViewProps = {
  width: number;
  height: number;
  mountView?: (domElem: HTMLElement, width: number, height: number) => void;
};

const mountNothing = (domElem: HTMLElement, width: number, height: number) => {
  return;
};

const GPUView = ({ width, height, mountView }: GPUViewProps) => {
  const toCall = !useContext(EnableGPUContext)
    ? mountNothing
    : mountView ?? init;
  const css = { width: `${width}px`, height: `${height}px` };

  const elemRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    toCall(elemRef.current!, width, height);
  });

  return (
    <div className="gpu-view" style={css}>
      <div className="gpu-view-frame" ref={elemRef}></div>
    </div>
  );
};

export default GPUView;
