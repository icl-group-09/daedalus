import { useRef, useState } from 'react'
import { Canvas, useFrame, ReactThreeFiber } from '@react-three/fiber'

function Box(props: {position: number[]}) {
  const mesh = useRef<ReactThreeFiber.MeshProps>()

  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  const rot = Math.random();
  useFrame(() => (mesh.current!.rotation.x += rot))

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 2.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function App() {
  return (
    <div className="App" style={{textAlign: "center"}}>
      <h1>Hover over / click on one of the cubes</h1>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-3.2, 0, 0]} />
        <Box position={[3.2, 0, 0]} />
      </Canvas>
    </div>
  );
}

export default App;
