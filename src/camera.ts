import * as THREE from "three";
import { FOV, SCREEN_SIZE } from "./constants";
import { scene } from "./scene";
import { gui } from "./gui";

// Camera
export const camera = new THREE.PerspectiveCamera(
  FOV,
  SCREEN_SIZE.width / SCREEN_SIZE.height,
  1,
  20000
);

export const addCamera = () => {
  camera.position.set(35, 20, 40);
  scene.add(camera);

  return camera;
};

// GUI
const folderCamera = gui.addFolder("Camera");
folderCamera.add(camera.position, "x", -180, 180, 0.1);
folderCamera.add(camera.position, "y", -100, 100, 0.1);
folderCamera.add(camera.position, "z", -100, 100, 0.1);

folderCamera.close();
