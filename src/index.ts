import { addCasa } from "./casa";
import { addCamera } from "./camera";
import { addEnv } from "./env";
import { addRenderer } from "./animation";

// Camera:
addCamera();

// Env:
const env = addEnv();

// Casa:
addCasa();

// Renderer:
const onUpdate = (elapsedTime: number) => {
  env.onUpdate(elapsedTime);
};
addRenderer(onUpdate);
