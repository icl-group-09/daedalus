import { RenderType } from "./RenderType";
import { RotationDir } from "./Rotate";

export interface IGraphicsHandler {
  uploadAsToGTLF(
    pcdFilename: string,
    mode: RenderType,
    pcdPointSize: number,
    cb: (path: string) => void
  ): void;
  renderPCD(pcdFilename: string, mode: RenderType, pcdPointSize: number): void;
  resizeRenderer(width: number, height: number): void;
  rotatePCD(rotateDir: RotationDir): void;
}


export const DUMMY_GRAPHICS_HANDLER: IGraphicsHandler = {
  uploadAsToGTLF: (
    pcdFilename: string,
    mode: RenderType,
    pcdPointSize: number,
    cb: (path: string) => void
  ) => {},
  renderPCD: (pcdFilename: String) => {},
  resizeRenderer: (width: number, height: number) => {},
  rotatePCD: (rotateDir: RotationDir) => {},
};