import * as THREE from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderType } from "./RenderType";

export interface IGraphicsHandler {
  renderPCD(pcdFilename: String, mode: RenderType, pcdPointSize: number): string;
  resizeRenderer(width: number, height: number): void;
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
    
    new THREE.CubeTextureLoader()
    .setPath('/')
    .load(
        // urls of images used in the cube texture
        [
            'purplenebula_ft.png',
            'purplenebula_bk.png',
            'purplenebula_lf.png',
            'purplenebula_rt.png',
            'purplenebula_up.png',
            'purplenebula_dn.png'
        ],
        // what to do when loading is over
         (cubeTexture) => {
            // Geometry
            const skybox = new THREE.BoxGeometry(10000, 10000, 10000);
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

  private createPathStrings(filename: String) {
    const basePath = "/";
    const baseFilename = basePath + filename;
    const fileType = ".png";
    const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
    const pathStrings = sides.map(side => {
      return baseFilename + "_" + side + fileType;
    });
    return pathStrings;
  }

  private createMaterialArray(filename: String) {
    const skyboxImagepaths = this.createPathStrings(filename);
    const materialArray = skyboxImagepaths.map(image => {
      let texture = new THREE.TextureLoader().load(image);
      return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }); // <---
    });
    return materialArray;
  }

  private initSkyBox() {
    const materialArray = this.createMaterialArray("purplenebula");
    console.log(materialArray);
    const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
    const skybox = new THREE.Mesh(skyboxGeo, materialArray);
    this.scene.add(skybox);
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

  resizeRenderer(width: number, height: number) {
    this.camera.aspect = width / height;
    this.renderer.setSize(width, height);
  }

  renderPCD(
    pcdFilename: string,
    renderType: RenderType,
    pcdPointSize: number
  ): string {
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
    return "torus.gltf"
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
