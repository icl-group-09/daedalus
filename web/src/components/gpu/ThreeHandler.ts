import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderType } from "./RenderType";
import { RotationDir } from "./Rotate";
import { IGraphicsHandler } from "./IGraphicsHandler"

export class ThreeHandler implements IGraphicsHandler {

  // Renderer Objects 
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly controls; 
  private readonly camera: THREE.PerspectiveCamera;

  // Current Scene Properties
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
  private cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial[]> = new THREE.Mesh();

  // Singleton Three Handler
  private static instance: ThreeHandler;

  public static getInstance(width: number, height: number, canvas: HTMLCanvasElement): ThreeHandler {
    if (!ThreeHandler.instance) {
      ThreeHandler.instance = new ThreeHandler(width, height, canvas);
    }
    return ThreeHandler.instance;
  }

  private constructor(width: number, height: number, canvas: HTMLCanvasElement) {
    this.camera = new THREE.PerspectiveCamera(30, width / height, 0.01, 40);
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.initSkybox()
    this.initCamera();
    this.initRenderer(width, height);
    this.initControls();
    this.renderScene();
  }

  private initSkybox() {
    let geometry = new THREE.BoxGeometry(25,25,25);
    // Must be right, left, up, down, front, back
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
    this.cube = new THREE.Mesh( geometry, cubeMaterials );
    this.scene.add(this.cube);
  }


  private initCamera() {
    this.camera.position.set(1200, -250, 2000);
    this.controls.update();
    this.scene.add(this.camera);
  }

  private initRenderer(width: number, height: number) {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
  }

  private initControls() {
    this.controls.addEventListener("change", () => {
      this.renderScene();
    });
    this.controls.minDistance = 0.5;
    this.controls.maxDistance = 10;
    this.controls.update();
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
    this.renderScene();
  }

  private createModelAnd(
    pcdFilename: string,
    renderType: RenderType,
    pcdPointSize: number,
    cb: () => void
  ) {
    if (this.points === undefined || pcdFilename !== this.currentFile) {
      this.currentFile = pcdFilename;
      const loader = new PCDLoader();

      loader.load(`/getPcd/${pcdFilename}.pcd`, points => {
        if (this.points !== undefined) {
          this.scene.remove(this.points);
        }
        this.points = points;
        this.originalPointsColors = points.geometry.getAttribute("color");
        points.geometry.rotateX(Math.PI);
        this.setPointsProperties(points, pcdPointSize, renderType);
        this.scene.add(points);
        cb();
      });
    } else {
      this.setPointsProperties(this.points, pcdPointSize, renderType);
      cb();
    }
  }


  uploadAsToGTLF(
    pcdFilename: string,
    mode: RenderType,
    pcdPointSize: number,
    cb: (path: string) => void
  ): void {
    const parse = () => {
      // Get string gltf
      this.scene.remove(this.cube);
      const exporter = new GLTFExporter();
      exporter.parse(
        this.scene,
        gltf => {
          fetch("/upload_parsed", {
            method: "POST",
            // NOTE: CORS here will have to be investigated when we do deployment
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
              "Content-Type": "application/json",
            },
            // Note: here we want to stringify the gltf before we stringify the whole payload
            body: JSON.stringify({ rawGLTF: JSON.stringify(gltf) }),
          })
            .then(res => res.json())
            .then(data => {
              this.scene.add(this.cube); 
              cb(data.path)
            });
        }, {}
      );
    };
    this.createModelAnd(pcdFilename, mode, pcdPointSize, parse);
  }

  renderPCD(
    pcdFilename: string,
    renderType: RenderType,
    pcdPointSize: number
  ): void {
    const renderCB = () => this.renderScene()
    this.createModelAnd(pcdFilename, renderType, pcdPointSize, renderCB);
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
      const color = new THREE.Color(heightProp, 0, 1 - heightProp);
      colors.push(color.r, color.g, color.b);
    }
    points.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
  }

  private loadHeightMap() {
    var img = new Image()
    img.onload = function () {
      var canvas = document.createElement( 'canvas' );
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext( '2d' );
        var size = img.width * img.height;
        var data = new Float32Array( size );
        context!.drawImage(img,0,0);
        for ( var i = 0; i < size; i ++ ) {
            data[i] = 0
        }
        var imgd = context!.getImageData(0, 0, img.width, img.height);
        var pix = imgd.data;
        var j=0;
        for (var m = 0; m<pix.length; m+=4) {
            var all = pix[m]+pix[m+1]+pix[m+2];
            data[j++] = all/(12);
        }
        console.log("hi")
        return data;
    }
    img.src = "/thing2.tif"
  }

  

  private renderScene() {
    this.renderer.render(this.scene, this.camera);
  }
}
