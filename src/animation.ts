import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SCREEN_SIZE, canvas } from "./constants";
import { camera } from "./camera";
import { scene } from "./scene";
import { loaderManager } from "./loader";
import gsap from "gsap";

// Renderer
export const renderer = new THREE.WebGLRenderer({ canvas });

export const addRenderer = (
  onUpdate: (elapsedTime: number) => void = (_elapsedTime: number) => {}
) => {
  renderer.setSize(SCREEN_SIZE.width, SCREEN_SIZE.height);
  renderer.render(scene, camera);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;

  // Controls:
  const controls = new OrbitControls(camera, canvas);
  controls.minDistance = 20;
  controls.maxDistance = 150;
  controls.maxPolarAngle = Math.PI / 2 - 0.2;

  controls.enableDamping = true;

  const clock = new THREE.Clock();

  loaderManager.onLoad = () => {
    // Camera animation:
    gsap.to(camera.position, {
      x: 20,
      y: 2,
      z: 85,
      duration: 2.5,
      ease: "expo",
    });

    // fade in scene:
    gsap.fromTo(
      renderer.domElement,
      { opacity: 0 },
      { opacity: 1, duration: 2.5, ease: "ease-in-out" }
    );
  };

  const tick = () => {
    // Update objects
    const elapsedTime = clock.getElapsedTime();
    onUpdate(elapsedTime);
    controls.update();
    requestAnimationFrame(tick);
    renderer.render(scene, camera);
  };

  tick();

  window.addEventListener("resize", () => {
    SCREEN_SIZE.height = window.innerHeight;
    SCREEN_SIZE.width = window.innerWidth;

    camera.aspect = SCREEN_SIZE.width / SCREEN_SIZE.height;
    camera.updateProjectionMatrix();

    renderer.setSize(SCREEN_SIZE.width, SCREEN_SIZE.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
};
