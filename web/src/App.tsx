import { useState } from "react"
import GPUView from "./gpu/GPUView"
import HelloWorld from "./api/HelloWorld"

function App() {
  // These are here just for the demo. Will be removed
  const [w, setW] = useState(800)
  const [h, setH] = useState(800)
  ;(window as any).funkyFunc = (x: number, y: number) => {
    setW(x)
    setH(y)
  }

  const [showPointCloud, setShowPointCloud] = useState(true);

  const handleClick = () => {
    setShowPointCloud(!showPointCloud);
  };

  const cssCenter = {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  } as const

  return (
    <div className="App" style={cssCenter}>
      <HelloWorld />
      <h1>The view should resize by call of 'funkyFunc'</h1>
      <button onClick={handleClick}>Show Point Cloud</button>
      <button>Show Heat Map</button>
      <button>Show 2D Map</button>
      {showPointCloud &&
      <GPUView height={h} width={w} />
    }
    
    </div>
  )
}

export default App
