import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { vertexShader, fragmentShader } from "./shaders.js";

gsap.registerPlugin(ScrollTrigger);

//
// ================= LENIS + SCROLLTRIGGER FIX =================
//

const lenis = new Lenis({
  lerp: 0.08,
  smoothWheel: true,
});

// RAF loop (ONLY ONE)
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 👉 INI PALING PENTING — SCROLL PROXY
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    return arguments.length
      ? lenis.scrollTo(value, { immediate: true })
      : lenis.scroll;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
});

lenis.on("scroll", ScrollTrigger.update);
ScrollTrigger.addEventListener("refresh", () => lenis.resize());
ScrollTrigger.refresh();

//
// ================= THREE SETUP =================
//

const canvas = document.querySelector(".hero-canvas");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

//
// TEXTURE
//
const texture = new THREE.TextureLoader().load("IMG/main.jpeg");

//
// SHADER MATERIAL
//
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uTexture: { value: texture },
  },
  vertexShader,
  fragmentShader,
  transparent: true,
});

const geometry = new THREE.PlaneGeometry(2.5, 1.5, 128, 128);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//
// ================= SCROLL ANIMATION =================
//

gsap.to(material.uniforms.uProgress, {
  value: 1,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
});

//
// LOOP
//
function animate() {
  material.uniforms.uTime.value += 0.02;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

//
// RESIZE
//
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
