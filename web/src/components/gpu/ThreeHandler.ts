import * as THREE from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {RenderType} from "./RenderType"

export interface IGraphicsHandler {
  renderPCD(domElement: HTMLElement, pcdFilename: String, mode: RenderType): void;
  resizeRenderer(width: number, height: number): void;
}

export class ThreeHandler implements IGraphicsHandler {
  private readonly renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  private readonly scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;

  constructor(width: number, height: number) {
    this.camera = new THREE.PerspectiveCamera(30, width / height, 0.01, 40);
    this.initCamera();
    this.initRenderer(width, height);
    this.initControls();
  }

  private initCamera() {
    this.camera.position.set(0, 0, 1);
    this.scene.add(this.camera);
  }

  private initRenderer(width: number, height: number) {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
  }

  private initControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.addEventListener("change", () => {
      this.renderScene();
    });
    controls.minDistance = 0.5;
    controls.maxDistance = 10;
  }

  resizeRenderer(width: number, height: number) {
    this.camera.aspect = width / height;
    this.renderer.setSize(width, height);
  }

  renderPCD(domElem: HTMLElement, pcdFilename: String, mode: RenderType): void {
    // Mount the GPU view to the HTML
    const children = domElem.children;
    if (children.length > 0) {
      domElem.removeChild(children[children.length - 1]);
    }
    domElem.appendChild(this.renderer.domElement);

    switch(mode){
      case RenderType.PCD:{
        this.loadPCD(pcdFilename);
        break;
      }
      case RenderType.HM:{
        this.loadHM(pcdFilename);
        break;
      }
    }

    this.renderScene();
  }



  private loadPCD(pcdFilename : String){
    const loader = new PCDLoader();
    loader.load(`/getPcd/${pcdFilename}.pcd`, points => {
      points.geometry.center();
      points.geometry.rotateX(Math.PI);
      this.scene.add(points);
      this.renderScene();
    });
  }

  private loadHM(hmFilename: String) {
    const loader = new PCDLoader();
    loader.load(`/getPcd/${hmFilename}.pcd`, points => {
      const numPoints = points.geometry.attributes.position.count;
      var minY = 1000000;
      var maxY = -1000000;
      for (var i = 0; i < numPoints; i++) {
        const y = points.geometry.attributes.position.array[i * 3 + 1];

        if (y < minY) {
          minY = y;
        }

        if (y > maxY) {
          maxY = y;
        }
      }

      const range = maxY - minY;
      const bottomColor = 0xFF0000;
      const topColor = 0x0000FF;

      const colors = [];
      for (var j = 0; j < numPoints; j++) {
        const y = points.geometry.attributes.position.array[j * 3 + 1];
        const heightProp = (y - minY) / range;
        const colorRep = heightProp * topColor + (1 - heightProp) * bottomColor;
        const color = new THREE.Color(colorRep);
        colors.push(color.r, color.g, color.b);
      }
      points.geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      points.material = new THREE.PointsMaterial( { size: 0.003, vertexColors: true } )
      points.geometry.center();
      points.geometry.rotateX(Math.PI);
      this.scene.add(points);
      this.renderScene();
    });
  }

  private renderScene() {
    this.renderer.render(this.scene, this.camera);
  }
}
