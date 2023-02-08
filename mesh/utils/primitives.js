import * as THREE from 'three';

let plane, donut;

function createPlane(scene, width, height, material, color, position, receiveShadow) {
   const planeGeometry = new THREE.PlaneGeometry(width, height);
   const planeMaterial = new material({
      color: color,
   });
   plane = new THREE.Mesh(planeGeometry, planeMaterial);
   plane.position.set(position.x, position.y - 0.05, position.z);
   plane.rotation.x = THREE.Math.degToRad(-90);
   plane.receiveShadow = receiveShadow;
   scene.add(plane);
}

function createDonut(scene, radius, tube, radialSeg, tubeSeg, material, color) {
   const donutGeometry = new THREE.TorusGeometry(radius, tube, radialSeg, tubeSeg);
   const donutMaterial = new material({
      color: color,
   });
   donut = new THREE.Mesh(donutGeometry, donutMaterial);
   donut.matrixAutoUpdate = false;
   donut.visible = false;
   scene.add(donut);
   return donut;
}

export { createPlane, createDonut };
