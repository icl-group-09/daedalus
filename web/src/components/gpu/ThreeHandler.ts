import * as THREE from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderType } from "./RenderType";
import { RotationDir } from "./Rotate";
import { IGraphicsHandler } from "./IGraphicsHandler"

export class ThreeHandler implements IGraphicsHandler {
  private readonly renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  private readonly scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private currentFile?: String;
  private points?: THREE.Points<
    THREE.BufferGeometry,
    THREE.Material | THREE.Material[]
  >;
  private originalPointsColors?:
    | THREE.BufferAttribute
    | THREE.InterleavedBufferAttribute;
  private currRotation = {X: 0, Y: 0, Z: 0}
  private isHeatMap = false;

  private static instance: ThreeHandler;


  private constructor(width: number, height: number, canvas: HTMLCanvasElement) {
    this.camera = new THREE.PerspectiveCamera(30, width / height, 0.01, 40);
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
    this.createCubeTexture()
    this.initCamera();
    this.initRenderer(width, height);
    this.initControls();
    this.renderScene();
  
  }

  private createCubeTexture() {
    let geometry = new THREE.BoxGeometry(25,25,25);
    const images = [
      'highresbox_rt.png',
      'highresbox_lf.png',
      'highresbox_up.png',
      'highresbox_dn.png',
      'highresbox_ft.png',
      'highresbox_bk.png'
      
    ]
    const cubeMaterials = images.map(image => {
      return new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(image), side: THREE.DoubleSide })
    })
    const cube = new THREE.Mesh( geometry, cubeMaterials );
    this.scene.add(cube);
  }

  public static getInstance(width: number, height: number, canvas: HTMLCanvasElement): ThreeHandler {
    if (!ThreeHandler.instance) {
      ThreeHandler.instance = new ThreeHandler(width, height, canvas);
    }
    return ThreeHandler.instance;
  }

  private initCamera() {
    this.camera.position.set(1200, -250, 2000);
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

  rotatePCD(rotateDir: RotationDir) {
      if (this.points !== undefined) {
        this.points.geometry.rotateX(rotateDir.X - this.currRotation.X);
        this.points.geometry.rotateY(rotateDir.Y - this.currRotation.Y);
        this.points.geometry.rotateZ(rotateDir.Z - this.currRotation.Z);
        this.currRotation = rotateDir;
        if (this.isHeatMap) {
          this.renderHeatMap(this.points);
        }
        this.renderScene();
      }
  }

  resizeRenderer(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  renderPCD(
    pcdFilename: string,
    renderType: RenderType,
    pcdPointSize: number
  ): void {
    if (this.points === undefined || pcdFilename !== this.currentFile) {
      this.currentFile = pcdFilename;
      const loader = new PCDLoader();
      loader.load(`/getPcd/${pcdFilename}.pcd`, points => {
      // loader.load("/" + pcdFilename + ".pcd", points => {
        if (this.points !== undefined) {
          this.scene.remove(this.points);
        }
        this.points = points;
        this.originalPointsColors = points.geometry.getAttribute("color");
        points.geometry.rotateX(Math.PI);
        this.setPointsProperties(points, pcdPointSize, renderType);
        this.scene.add(points);
        this.renderScene();
      });
    } else {
      this.setPointsProperties(this.points, pcdPointSize, renderType);
      this.renderScene();
    }
  }

  private setPointsProperties(
    points: THREE.Points<
      THREE.BufferGeometry,
      THREE.Material | THREE.Material[]
    >,
    pcdPointSize: number,
    renderType: RenderType
  ) {
    let useVertexColors = this.originalPointsColors !== undefined;

    switch (renderType) {
      case RenderType.HM: {
        this.renderHeatMap(points);
        this.isHeatMap = true;
        useVertexColors = true;
        break;
      }
      default: {
        this.isHeatMap = false;
        if (useVertexColors) {
          points.geometry.setAttribute("color", this.originalPointsColors!);
        }
        break;
      }
    }

    points.material = new THREE.PointsMaterial({
      size: pcdPointSize,
      vertexColors: useVertexColors,
    });
    points.geometry.center();
  }

  private renderHeatMap(
    points: THREE.Points<
      THREE.BufferGeometry,
      THREE.Material | THREE.Material[]
    >
  ) {
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
      const color = new THREE.Color(heightProp, 0, 1 -heightProp);
      colors.push(color.r, color.g, color.b);
    }
    points.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
  }

  private renderScene() {
    this.renderer.render(this.scene, this.camera);
  }
}
