import React from "react";
import GPUView from "./GPUView";
import { IGraphicsHandler } from "./ThreeHandler";
import { render } from "@testing-library/react";
import { RenderType } from "./RenderType";

test("Expect inital GPUView to call renderPCD on mount", () => {
  const mockGraphicsHandler: IGraphicsHandler = {
    uploadAsToGTLF: jest.fn(() => {}),
    renderPCD: jest.fn((pcdFilename: String) => {}),
    resizeRenderer: jest.fn((width: number, height: number) => {}),
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
    />
  );

  expect(mockGraphicsHandler.renderPCD).toBeCalled();
});
