let scene, camera, renderer, controls, arBtton, loader;
let raycaster, mouseClick;
let box, torusKnot, cone;
let plate;
let spotLight, light;
let intense;
let startBtn = document.querySelector('.start-btn');
let isRotate = false;
let xrControl;
let isBox = true;
let reticle;
let hitTestSource = null;
let hitTestSourceRequested = false;

import { ARButton } from 'ARButton';
import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';
import { setupCamera, setupRender, setupOrbitControls } from './utils/basic.js';
import { createHemiLight, createShadowLight } from './utils/lights.js';
import { createPlane } from './utils/primitives.js';


function init() {
   const container = document.createElement('div');
   document.body.appendChild(container);

   scene = new THREE.Scene();
   camera = setupCamera();
   renderer = setupRender();
   controls = setupOrbitControls(camera, renderer.domElement);
   xrControl = renderer.xr.getController(0);
   scene.add(xrControl);
   raycaster = new THREE.Raycaster();
   mouseClick = new THREE.Vector2();
   container.appendChild(renderer.domElement);
   intense = 1;
   createHemiLight(scene, 0xffffff, 0xbbbbff, intense, new THREE.Vector3(0, 2, -5));
   createShadowLight(scene, 0xffffff, intense * 2, new THREE.Vector3(0, 2, 2));
   createPlane(scene, 10, 20, THREE.MeshStandardMaterial, 0x00ff00, new THREE.Vector3(0, -3, -10), true);

   const lightInput = document.getElementById('light');
   lightInput.addEventListener('input', () => {
      intense = lightInput.value;
      light.intensity = intense;
      console.log(intense);
   })


   const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.1, 25, 8);
   const torusKnotMaterial = new THREE.MeshLambertMaterial({
      color: 0xb54f9a,
      emissive: 0x000,
   });
   torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
   torusKnot.position.set(-2, 0, -5);
   torusKnot.castShadow = true;
   torusKnot.receiveShadow = true;
   torusKnot.userData.myObj = true;
   torusKnot.userData.name = 'torusKnot';
   scene.add(torusKnot);

   const coneGeometry = new THREE.ConeGeometry(0.5, 1.5, 7, true,);
   const coneMaterial = new THREE.MeshMatcapMaterial({
      color: 0xf4e59a,
      flatShading: true,
   });
   cone = new THREE.Mesh(coneGeometry, coneMaterial);
   cone.position.set(2, 0, -5);
   cone.castShadow = true;
   cone.userData.myObj = true;
   cone.userData.name = 'cone';
   scene.add(cone);

   reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.2, 32).rotateX(- Math.PI / 2),
      new THREE.MeshBasicMaterial()
   );
   reticle.matrixAutoUpdate = false;
   reticle.visible = false;
   scene.add(reticle);


   console.log(scene);
   arBtton = ARButton.createButton(renderer, {
      requiredFeatures: ['hit-test'],
   });// +BUtton
   document.body.appendChild(arBtton);

   window.addEventListener('resize', onWindowResize(), false);
}
function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
   renderer.setAnimationLoop(render);
   controls.update();
}



function render(timestamp, frame) {
   if (frame) {
      const referenceSpace = renderer.xr.getReferenceSpace();
      const session = renderer.xr.getSession();
      if (hitTestSourceRequested === false) {
         session.requestReferenceSpace('viewer').then(function (referenceSpace) {
            session.requestHitTestSource({ space: referenceSpace }).then(function (source) {
               hitTestSource = source;
            })
         })
         session.addEventListener('end', function () {
            hitTestSourceRequested = false;
            hitTestSource = null;
         });
         hitTestSourceRequested = true;
      }
      if (hitTestSource) {
         const hitTestResults = frame.getHitTestResults(hitTestSource);
         if (hitTestResults.length) {
            const hit = hitTestResults[0];

            reticle.visible = true;
            reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
         } else {
            reticle.visible = false;
         }
      }
   }
   if (isRotate) {
      rotateBox();
   }
   rotateCone();
   rotatetorusKnot();
   renderer.render(scene, camera);
}
startBtn.addEventListener('click', () => {
   isRotate = !isRotate;
   startBtn.classList.toggle('active');
});

function rotateBox() {
   box.rotation.y += 0.02;
   box.rotation.x += 0.02;
}
function rotateCone() {
   cone.rotation.y -= 0.02;
   cone.rotation.z -= 0.01;
}
function rotatetorusKnot() {
   torusKnot.rotation.x -= 0.02;
   torusKnot.rotation.z -= 0.01;
}

window.requestAnimationFrame(render);
init()
animate()
const cubeY = document.getElementById('cube-y');
cubeY.addEventListener('input', () => {
   box.position.y = cubeY.value;
   console.log(e.target.value)
});

const cubeColor = document.getElementById('cube-color');
cubeColor.addEventListener('input', () => {
   box.material.color.set(cubeColor.value);
   console.log(cubeColor.value)
})

let myObj;
window.addEventListener('click', (event) => {
   mouseClick.x = (event.clientX / window.innerWidth) * 2 - 1;
   mouseClick.y = - (event.clientY / window.innerHeight) * 2 + 1;

   raycaster.setFromCamera(mouseClick, camera);
   const found = raycaster.intersectObjects(scene.children);
   if (found.length > 0 && found[0].object.userData.myObj) {
      myObj = found[0].object;
      myObj.material.color.set(0x000000)
      console.log('my name is ' + myObj.userData.name)
   }

})
function createBox() {
   const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
   const boxMaterial = new THREE.MeshPhongMaterial({
      color: 0x5660ef,
      flatShading: true,
   });
   box = new THREE.Mesh(boxGeometry, boxMaterial);
   box.position.set(0, 0, -3).applyMatrix4(xrControl.matrixWorld);
   box.castShadow = true;
   scene.add(box);

   box.userData.myObj = true;
   box.userData.name = 'box';
}

function onClick() {
   if (reticle.visible) {
      createBox();
      box.position.setFromMatrixPosition(reticle.matrix);
   }
}

xrControl.addEventListener('select', () => {
   scene.remove(box);
   onClick();
})
