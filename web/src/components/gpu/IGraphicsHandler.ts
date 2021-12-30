import { RenderType } from "./RenderType";
import { RotationDir } from "./Rotate";

export interface IGraphicsHandler {
  renderPCD(pcdFilename: String, mode: RenderType, pcdPointSize: number): void;
  resizeRenderer(width: number, height: number): void;
  rotatePCD(rotateDir: RotationDir): void;
}

export const DUMMY_GRAPHICS_HANDLER: IGraphicsHandler = {
  renderPCD: (pcdFilename: String) => {},
  resizeRenderer: (width: number, height: number) => {},
  rotatePCD: (rotateDir: RotationDir) => {},
};