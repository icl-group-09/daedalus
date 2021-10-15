import { useEffect, useRef } from "react"

import * as THREE from 'three'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

function init(domElem: HTMLElement, width: number, height: number) {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  
  // Mount the GPU view to the HTML 
  const children = domElem.children
  if (children.length > 0) {
    domElem.removeChild(children[children.length - 1])
  }
  domElem.appendChild(renderer.domElement)
  
  const camera = new THREE.PerspectiveCamera(30, width / height, 0.01, 40)
  camera.position.set(0, 0, 1)

  const scene = new THREE.Scene()
  scene.add(camera)
  
  const render = () => { renderer.render(scene, camera) }
  
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', render)
  controls.minDistance = 0.5
  controls.maxDistance = 10
  
  const loader = new PCDLoader()
  loader.load('online.pcd', (points) => {
  	points.geometry.center()
  	points.geometry.rotateX(Math.PI)
  	scene.add(points)
  
  	render()
  })
  
  return {renderer, scene, camera}
}

type GPUViewProps = {
  width: number;
  height: number;
}

const GPUView = ({ width, height }: GPUViewProps) => {
  const css = {width: `${width}px`, height: `${height}px`}

  const elemRef = useRef<HTMLDivElement>(null);

  useEffect(() => { // Run the first time this component renders
    const { renderer, scene, camera } = init(elemRef.current!, width, height);
    renderer.render(scene, camera);
  })

  return (
    <div className="gpu-view" style={css}>
      <div className="gpu-view-frame" ref={elemRef}></div>
    </div>
  )
}

export default GPUView
