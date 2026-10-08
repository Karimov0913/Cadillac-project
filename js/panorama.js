// Настоящая панорама заводского салона: шесть фотографических граней, не макет.
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export async function createPanorama(container, color = "black") {
  const canvas = document.createElement("canvas"),
    context = canvas.getContext("webgl2", { antialias: true });
  if (!context) throw new Error("WebGL 2 unavailable");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    context,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  container.append(canvas);
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(78, 1, 0.01, 10);
  camera.position.set(0, 0, 0.1);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.rotateSpeed = -0.35;
  controls.target.set(0, 0, 0);
  const faces = ["l", "r", "u", "d", "b", "f"].map(
    (face) =>
      new URL(`../assets/v2/pano-${color}-${face}.webp`, import.meta.url).href,
  );
  const texture = await new THREE.CubeTextureLoader().loadAsync(faces);
  texture.colorSpace = THREE.SRGBColorSpace;
  scene.background = texture;
  let disposed = false,
    raf;
  const resize = () => {
    const w = container.clientWidth,
      h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();
  const wheel = (e) => {
    e.preventDefault();
    camera.fov = THREE.MathUtils.clamp(camera.fov + e.deltaY * 0.04, 35, 90);
    camera.updateProjectionMatrix();
  };
  canvas.addEventListener("wheel", wheel, { passive: false });
  const animate = () => {
    if (disposed) return;
    raf = requestAnimationFrame(animate);
    if (document.hidden || container.hidden) return;
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      controls.dispose();
      texture.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
