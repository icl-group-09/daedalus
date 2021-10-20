import React from "react";
import { useState, useEffect } from "react";
import GPUView from "./components/gpu/GPUView";
import { IGraphicsHandler, ThreeHandler } from "./components/gpu/ThreeHandler";
import getHello from "./services/GetHello";

function App() {
  // These are here just for the demo. Will be removed
  const [toPrint, setToPrint] = useState("Nothing from the server yet!");
  const [w, setW] = useState(800);
  const [h, setH] = useState(800);
  (window as any).funkyFunc = (x: number, y: number) => {
    setW(x);
    setH(y);
  };

  const cssCenter = {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  } as const;

  useEffect(() => {
    getHello().then(resObj => setToPrint(JSON.stringify(resObj)));
  });

  const graphicsHandler: IGraphicsHandler = new ThreeHandler(w, h);

  return (
    <div className="App" style={cssCenter}>
      <div> {toPrint} </div>
      <h1>The view should resize by call of 'funkyFunc'</h1>
      <GPUView width={w} height={h} graphicsHandler={graphicsHandler} />
    </div>
  );
}

export default App;
