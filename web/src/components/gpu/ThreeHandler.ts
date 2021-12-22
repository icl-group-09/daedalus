import * as THREE from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderType } from "./RenderType";
import { RotationDir } from "./Rotate";

export interface IGraphicsHandler {
  renderPCD(pcdFilename: String, mode: RenderType, pcdPointSize: number): void;
  resizeRenderer(width: number, height: number): void;
  rotatePCD(rotateDir: RotationDir): void;
}

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

  private static instance: ThreeHandler;

  private constructor(width: number, height: number, canvas: HTMLCanvasElement) {
    this.camera = new THREE.PerspectiveCamera(30, width / height, 0.01, 40);
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
    this.initCamera();
    this.initRenderer(width, height);
    this.initControls();
    this.createSkybox();
  
  }

  private createSkybox() {
    new THREE.CubeTextureLoader()
    .setPath('/')
    .load(
        // urls of images used in the cube texture
        // Order must be rt, lf, up, dn, ft, bk
        [
            'water_box_rt.jpg',
            'water_box_lf.jpg',
            'water_box_up.jpg',
            'water_box_dn.jpg',
            'water_box_ft.jpg',
            'water_box_bk.jpg'
            
        ],
        // what to do when loading is over
         (cubeTexture) => {
            // Geometry
            const skybox = new THREE.BoxGeometry(100000, 100000, 100000);
            // Material
            var material = new THREE.MeshBasicMaterial({
                // CUBE TEXTURE can be used with
                // the environment map property of
                // a material.
                envMap: cubeTexture
            });
            // Mesh
            var mesh = new THREE.Mesh(skybox, material);
            this.scene.add(mesh);
            // CUBE TEXTURE is also an option for a background
            this.scene.background = cubeTexture;
            this.renderer.render(this.scene, this.camera);
        }
    );
  }  

  public static getInstance(width: number, height: number, canvas: HTMLCanvasElement): ThreeHandler {
    if (!ThreeHandler.instance) {
      ThreeHandler.instance = new ThreeHandler(width, height, canvas);
    }
    return ThreeHandler.instance;
  }

  private initCamera() {
    /// this.camera.position.set(0, 0, 1);
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
        this.points.geometry.rotateX(rotateDir.X);
        this.points.geometry.rotateY(rotateDir.Y);
        this.points.geometry.rotateZ(rotateDir.Z);
        this.renderHeatMap(this.points);
        this.renderScene();
      }
  }

  resizeRenderer(width: number, height: number) {
    this.camera.aspect = width / height;
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
        useVertexColors = true;
        break;
      }
      default: {
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
