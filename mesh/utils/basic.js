import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

let camera, renderer, controls;

function setupCamera() {
   camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200)
   camera.position.z = 1;

   return camera;
}

function setupRender() {
   renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
   });
   renderer.setPixelRatio(window.devicePixelRatio);
   renderer.setSize(window.innerWidth / window.innerHeight);
   renderer.xr.enabled = true;
   renderer.shadowMap.enabled = true;
   renderer.shadowMap.type = THREE.PCFShadowMap;

   return renderer;
}

function setupOrbitControls(camera, domElement) {
   controls = new OrbitControls(camera, domElement);
   controls.update();

   return controls;
}

export { setupCamera, setupRender, setupOrbitControls };