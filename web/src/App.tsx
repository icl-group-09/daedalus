import { useState, useEffect } from "react"
import GPUView from "./components/gpu/GPUView"
import getHello from "./services/GetHello"

function App() {
  // These are here just for the demo. Will be removed
  const [toPrint, setToPrint] = useState("Nothing from the server yet!")
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

  useEffect(() => {
    getHello().then(resObj => setToPrint(JSON.stringify(resObj)))
  })

  return (
    <div className="App" style={cssCenter}>
      <div> {toPrint} </div>
      <h1>The view should resize by call of 'funkyFunc'</h1>
      <GPUView height={h} width={w} />
    </div>
  )
}

export default App
