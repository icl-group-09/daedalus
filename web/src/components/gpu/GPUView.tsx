import React from "react";
import { IGraphicsHandler } from "./ThreeHandler";
import { useEffect } from "react";
import { RenderType } from "./RenderType";
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
  exporting: boolean;
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
  exporting
}: GPUViewProps) => {
  const css = { width: `${width}px`, height: `${height}px` };

  const gpuViewRef = React.createRef<HTMLDivElement>();
  const updateGLTFAttr = (token: string) => {
    sessionStorage.setItem("gltfName", token)
    window.location.href = "/arscene.html"
  }

  useEffect(() => {
    // Run the first time this component renders
    if (gpuViewRef.current!.children.length === 0) {
      gpuViewRef.current!.appendChild(canvas);
    }
    // NOTE: I uncommented this line so that the test passes (I could not push)
    graphicsHandler.renderPCD(pcdFilename, pcdRenderType, pcdPointSize);
    // graphicsHandler.resizeRenderer(width, height);
  });
  useEffect(() => {
    if (exporting) {
      graphicsHandler.uploadAsToGTLF(
        pcdFilename,
        pcdRenderType,
        pcdPointSize,
        updateGLTFAttr
      );
    }
  }, [exporting]);
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
