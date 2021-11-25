import * as THREE from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {RenderType} from "./RenderType"

export interface IGraphicsHandler {
  renderPCD(domElement: HTMLElement, pcdFilename: String, mode: RenderType, pcdPointSize: number): void;
  resizeRenderer(width: number, height: number): void;
}

export class ThreeHandler implements IGraphicsHandler {
  private readonly renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  private readonly scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;

  constructor(width: number, height: number) {
    this.camera = new THREE.PerspectiveCamera(30, width / height, 0.01, 40);
    this.initCamera();
    this.initRenderer(width, height);
   // this.initSkyBox();
    this.initControls();
    this.loadHeightMap();
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

  renderPCD(domElem: HTMLElement, pcdFilename: string, mode: RenderType, pcdPointSize: number): void {
    // Mount the GPU view to the HTML
    const children = domElem.children;
    if (children.length > 0) {
      domElem.removeChild(children[children.length - 1]);
    }
    this.renderer.domElement.id = "canvas"
    domElem.appendChild(this.renderer.domElement);

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
    const loader = new PCDLoader();
    loader.load("/result.pcd", points => {
      if (isHeatMap) {
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
      points.material = new THREE.PointsMaterial( { size: pcdPointSize, vertexColors: true } )
      points.geometry.center();
      points.geometry.rotateX(Math.PI);
      this.scene.add(points);
      this.renderScene();
    });
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
