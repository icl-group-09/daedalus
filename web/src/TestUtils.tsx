import { EnableGPUContext } from "./App";

export const disableGPU = (comp: JSX.Element) => {
  return (
    <EnableGPUContext.Provider value={false}>{comp}</EnableGPUContext.Provider>
  );
};
