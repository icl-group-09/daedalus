import { useState } from "react"
import GPUView from "./gpu/GPUView"

function App() {
  // These are here just for the demo. Will be removed
  const [w, setW] = useState(800)
  const [h, setH] = useState(800)
  ;(window as any).funkyFunc = (x: number, y: number) => {
    setW(x)
    setH(y)
  }

  const cssCenter = {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  } as const

  return (
    <div className="App" style={cssCenter}>
      <h1>The view should resize by call of 'funkyFunc'</h1>
      <GPUView height={h} width={w} />
    </div>
  )
}

export default App
