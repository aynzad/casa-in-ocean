import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { renderer } from "./animation";
import { scene } from "./scene";
import { loaderManager } from "./loader";

export const addCasa = () => {
  const dracoLoader = new DRACOLoader(loaderManager);
  dracoLoader.setDecoderPath("/libs/draco/");
  dracoLoader.preload();

  const KTX2_LOADER = new KTX2Loader(loaderManager).setTranscoderPath(
    "three/examples/jsm/libs/basis/"
  );

  const gltfLoader = new GLTFLoader(loaderManager)
    .setDRACOLoader(dracoLoader)
    .setCrossOrigin("anonymous")
    .setKTX2Loader(KTX2_LOADER.detectSupport(renderer));

  const casa = new THREE.Group();

  gltfLoader.load(
    "/models/casa.glb",
    (gltf) => {
      const casaHouse = gltf.scene;
      casaHouse.position.set(-3, 3, -3);
      casaHouse.rotateY(-Math.PI / 3);
      casaHouse.castShadow = true;

      casa.add(casaHouse);
    },
    undefined,
    (error) => {
      console.log(error);
    }
  );

  scene.add(casa);

  return casa;
};
