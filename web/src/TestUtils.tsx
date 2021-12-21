import React from "react";
import { EnableGPUContext } from "./components/pages/Welcome";

export const disableGPU = (comp: JSX.Element) => {
  return (
    <EnableGPUContext.Provider value={false}>{comp}</EnableGPUContext.Provider>
  );
};
