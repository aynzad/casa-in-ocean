import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky";
import { Water } from "three/examples/jsm/objects/Water";
import { scene } from "./scene";
import { renderer } from "./animation";
import { gui } from "./gui";
import { loaderManager } from "./loader";

const parameters = {
  elevation: 2,
  azimuth: 180,
};

// Water
const waterGeometry = new THREE.PlaneGeometry(2000, 2000);
const water = new Water(waterGeometry, {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: new THREE.TextureLoader(loaderManager).load(
    import.meta.env.BASE_URL + "/textures/water_normal.jpg",
    function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  ),
  sunDirection: new THREE.Vector3(),
  sunColor: 0xffffff,
  waterColor: 0x001e0f,
  distortionScale: 3.7,
});
water.rotation.x = -Math.PI / 2;

// Sky
const sky = new Sky();
sky.scale.setScalar(10000);

const skyUniforms = sky.material.uniforms;

skyUniforms["turbidity"].value = 10;
skyUniforms["rayleigh"].value = 2;
skyUniforms["mieCoefficient"].value = 0.005;
skyUniforms["mieDirectionalG"].value = 0.8;

const sun = new THREE.Vector3();

let renderTarget: THREE.WebGLRenderTarget<THREE.Texture> | undefined;
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const sceneEnv = new THREE.Scene();

function updateSun() {
  const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
  const theta = THREE.MathUtils.degToRad(parameters.azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  sky.material.uniforms["sunPosition"].value.copy(sun);
  water.material.uniforms["sunDirection"].value.copy(sun).normalize();

  if (renderTarget !== undefined) renderTarget.dispose();

  sceneEnv.add(sky);
  renderTarget = pmremGenerator.fromScene(sceneEnv);
  scene.add(sky);

  scene.environment = renderTarget.texture;
}
updateSun();

const light1 = new THREE.AmbientLight("#ffffff", 1);
light1.position.set(0, 20, 0);

const light2 = new THREE.DirectionalLight(0xffefff, 2);
light2.position.set(0, 15, 15);

const light2Helper = new THREE.DirectionalLightHelper(light2, 5);
light2Helper.visible = false;

scene.add(light1, light2, light2Helper);

// environment
export const addEnv = () => {
  scene.add(water, sky);

  const onUpdate = (_elapsedTime: number) => {
    water.material.uniforms["time"].value += 0.5 / 60.0;
  };

  return { water, sky, onUpdate };
};

// GUI
const folderSky = gui.addFolder("Sky");
folderSky.add(parameters, "elevation", 0, 90, 0.01).onChange(updateSun);
folderSky.add(parameters, "azimuth", -180, 180, 0.1).onChange(updateSun);
folderSky.open();

const waterUniforms = water.material.uniforms;

const folderWater = gui.addFolder("Water");
folderWater
  .add(waterUniforms.distortionScale, "value", 0, 8, 0.1)
  .name("distortionScale");
folderWater.add(waterUniforms.size, "value", 0.1, 10, 0.1).name("size");

folderWater.open();
