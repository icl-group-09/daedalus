import * as THREE from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export interface IGraphicsHandler {
  renderPCD(domElement: HTMLElement): void;
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

  renderPCD(domElem: HTMLElement): void {
    // Mount the GPU view to the HTML
    const children = domElem.children;
    if (children.length > 0) {
      domElem.removeChild(children[children.length - 1]);
    }
    domElem.appendChild(this.renderer.domElement);

    this.loadPCD();

    this.renderScene();
  }

  private loadPCD() {
    const loader = new PCDLoader();
    loader.load("online.pcd", points => {
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
