import { useEffect, useRef, useContext } from "react";
import { EnableGPUContext } from "../../App";
import { init } from "./ThreeHandler";

type GPUViewProps = {
  width: number;
  height: number;
  pcd: string;
  mountView?: (domElem: HTMLElement, width: number, height: number) => void;
};

const mountNothing = (domElem: HTMLElement, width: number, height: number, pcd: string) => {
  return;
};

const GPUView = ({ width, height, mountView, pcd }: GPUViewProps) => {
  const toCall = !useContext(EnableGPUContext)
    ? mountNothing
    : mountView ?? init;
  const css = { width: `${width}px`, height: `${height}px` };

  const elemRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    toCall(elemRef.current!, width, height, pcd);
  });

  return (
    <div className="gpu-view" style={css}>
      <div className="gpu-view-frame" ref={elemRef}></div>
    </div>
  );
};

export default GPUView;
