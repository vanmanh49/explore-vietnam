import * as THREE from 'three';
import { seededRandom } from '../lib/noise';

/** Procedural sprite textures, created once and shared. */

let glowTexture: THREE.CanvasTexture | null = null;
let cloudTexture: THREE.CanvasTexture | null = null;

function createCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas is not available');
  return [canvas, context];
}

function softDisc(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  alpha: number,
): void {
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
  gradient.addColorStop(0.45, `rgba(255,255,255,${alpha * 0.35})`);
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

export function getGlowTexture(): THREE.CanvasTexture {
  if (!glowTexture) {
    const [canvas, context] = createCanvas(64);
    softDisc(context, 32, 32, 32, 1);
    glowTexture = new THREE.CanvasTexture(canvas);
    glowTexture.colorSpace = THREE.SRGBColorSpace;
  }
  return glowTexture;
}

export function getCloudTexture(): THREE.CanvasTexture {
  if (!cloudTexture) {
    const [canvas, context] = createCanvas(128);
    const random = seededRandom(7);
    for (let i = 0; i < 9; i += 1) {
      softDisc(context, 28 + random() * 72, 50 + random() * 28, 18 + random() * 22, 0.5);
    }
    cloudTexture = new THREE.CanvasTexture(canvas);
    cloudTexture.colorSpace = THREE.SRGBColorSpace;
  }
  return cloudTexture;
}
