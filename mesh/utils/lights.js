import * as THREE from 'three';
let hemilight;
let shadowLight;

function createHemiLight(scene, skyColor, groundColor, intensity, position) {
   hemilight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
   scene.add(hemilight);
   hemilight.position.set(position.x, position.y, position.z);
}

function createShadowLight(scene, color, intensity, position) {
   shadowLight = new THREE.DirectionalLight(color, intensity);
   shadowLight.position.set(position.x, position.y, position.z);
   shadowLight.castShadow = true;
   shadowLight.shadow.mapSize.width = 2048;
   shadowLight.shadow.mapSize.height = 2048;
   shadowLight.shadow.camera.near = 0.01;
   shadowLight.shadow.camera.far = 4000;
   shadowLight.shadow.camera.fov = 75;
   scene.add(shadowLight);
}

export { createHemiLight, createShadowLight };