import React from "react";
import GPUView from "./GPUView";
import { IGraphicsHandler } from "./ThreeHandler";
import { render } from "@testing-library/react";

test("Expect inital GPUView to call renderPCD on mount", () => {
  const mockGraphicsHandler: IGraphicsHandler = {
    renderPCD: jest.fn((domElement: HTMLElement, pcdFilename: String) => {}),
    resizeRenderer: jest.fn((width: number, height: number) => {}),
  };

  render(
    <GPUView
      height={80}
      width={80}
      graphicsHandler={mockGraphicsHandler}
      pcdFilename="dummyPCDName"
    />
  );

  expect(mockGraphicsHandler.renderPCD).toBeCalled();
});
