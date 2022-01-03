import React from "react";
import GPUView from "./GPUView";
import { IGraphicsHandler } from "./ThreeHandler";
import { render } from "@testing-library/react";
import { RenderType } from "./RenderType";
import { RotationDir } from "./Rotate"

test("Expect inital GPUView to call renderPCD on mount", () => {
  const mockGraphicsHandler: IGraphicsHandler = {
    renderPCD: jest.fn((pcdFilename: String) => {}),
    resizeRenderer: jest.fn((width: number, height: number) => {}),
    rotatePCD: jest.fn((rotateDir: RotationDir) => {})
  };

  const canvas: HTMLCanvasElement = document.createElement("canvas");

  render(
    <GPUView
      height={80}
      width={80}
      graphicsHandler={mockGraphicsHandler}
      pcdFilename="dummyPCDName"
      pcdRenderType={RenderType.PCD}
      pcdPointSize={0.005}
      canvas={canvas}
      rotateDir = {{X:0, Y:0, Z:0}}
    />
  );

  expect(mockGraphicsHandler.renderPCD).toBeCalled();
});


