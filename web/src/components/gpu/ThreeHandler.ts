import * as THREE from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {RenderType} from "./RenderType"

export interface IGraphicsHandler {
  renderPCD(domElement: HTMLElement, pcdFilename: String, mode: RenderType, pcdPointSize: number): void;
  resizeRenderer(width: number, height: number): void;
}

export class ThreeHandler implements IGraphicsHandler {
  private renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private currentFile?: String;
  private points?: THREE.Points<THREE.BufferGeometry, THREE.Material | THREE.Material[]>

  constructor(width: number, height: number, canvas: HTMLCanvasElement) {
	  console.log("I'm constructed!")
    this.camera = new THREE.PerspectiveCamera(30, width / height, 0.01, 40);
	this.renderer = new THREE.WebGLRenderer({canvas: canvas});
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

  renderPCD(domElem: HTMLElement, pcdFilename: string, mode: RenderType, pcdPointSize: number): void {
    switch(mode){
      case RenderType.PCD:{
        this.loadPCD(pcdFilename, false, pcdPointSize);
        break;
      }
      case RenderType.HM:{
        this.loadPCD(pcdFilename, true, pcdPointSize);
        break;
      }
    }

    this.renderScene();
  }

  private loadPCD(pcdFilename: string, isHeatMap: boolean, pcdPointSize: number) {
	console.log(this.currentFile)
	console.log(pcdFilename)
	if (pcdFilename !== this.currentFile) {
		this.currentFile = pcdFilename;
		const loader = new PCDLoader();
		loader.load("/resultm4.pcd", points => {
		  this.points = points;
		  this.setPointsProperties(points, pcdPointSize, isHeatMap)
		  this.scene.add(points);
		  this.renderScene();
		});
	} else {
		console.log("AHH")
		this.setPointsProperties(this.points!, pcdPointSize, isHeatMap);
		this.renderScene();
	}
    
  }

  private setPointsProperties(points: THREE.Points<THREE.BufferGeometry, THREE.Material | THREE.Material[]>, pcdPointSize: number, isHeadMap: boolean) {
	if (isHeadMap) {
		this.renderHeatMap(points)
	}
	points.material = new THREE.PointsMaterial( { size: pcdPointSize, vertexColors: true } )
	points.geometry.center();
	points.geometry.rotateX(Math.PI);
	//this.scene.add(points);

  }

  private renderHeatMap(points: THREE.Points<THREE.BufferGeometry, THREE.Material | THREE.Material[]>) {
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

	const colors = [];
	for (var j = 0; j < numPoints; j++) {
	  const y = points.geometry.attributes.position.array[j * 3 + 1];
	  const heightProp = (y - minY) / range;
	  const color = new THREE.Color(1*(1-heightProp), 0, 1 * heightProp);
	  colors.push(color.r, color.g, color.b);
	}
	points.geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  }

  private renderScene() {
    this.renderer.render(this.scene, this.camera);
  }
}
