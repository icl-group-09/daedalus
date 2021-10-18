import { useEffect, useRef } from "react"
import { init } from "./ThreeHandler"


type GPUViewProps = {
  width: number
  height: number
}

const GPUView = ({ width, height }: GPUViewProps) => {
  const css = { width: `${width}px`, height: `${height}px` }

  const elemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Run the first time this component renders
    init(elemRef.current!, width, height)
  })

  return (
    <div className="gpu-view" style={css}>
      <div className="gpu-view-frame" ref={elemRef}></div>
    </div>
  )
}

export default GPUView
