import { ARCHIPELAGOS } from '../data/archipelagos';
import { LAND_RINGS, project } from './geo';

const ISLET_RADIUS = 0.07;
const ISLET_POINTS = ARCHIPELAGOS.flatMap((archipelago) => archipelago.islets.map(project));

const LAND_PATH = LAND_RINGS.map(
  (ring) => `M${ring.map((point) => `${point.x.toFixed(3)} ${point.z.toFixed(3)}`).join('L')}Z`,
).join('');

/** Each offshore islet as a small circle. */
const ISLET_PATH = ISLET_POINTS.map(
  ({ x, z }) =>
    `M${(x - ISLET_RADIUS).toFixed(3)} ${z.toFixed(3)}a${ISLET_RADIUS} ${ISLET_RADIUS} 0 1 0 ${ISLET_RADIUS * 2} 0a${ISLET_RADIUS} ${ISLET_RADIUS} 0 1 0 ${-ISLET_RADIUS * 2} 0Z`,
).join('');

/**
 * The outline of Vietnam as SVG path data, in map units (north is up),
 * including the Hoàng Sa and Trường Sa archipelagos.
 */
export const OUTLINE_PATH = LAND_PATH + ISLET_PATH;

const PADDING = 0.4;
const OUTLINE_POINTS = [...LAND_RINGS.flat(), ...ISLET_POINTS];
const xs = OUTLINE_POINTS.map((point) => point.x);
const zs = OUTLINE_POINTS.map((point) => point.z);
const minX = Math.min(...xs) - PADDING;
const minZ = Math.min(...zs) - PADDING;

export const OUTLINE_BOUNDS = {
  x: minX,
  y: minZ,
  width: Math.max(...xs) + PADDING - minX,
  height: Math.max(...zs) + PADDING - minZ,
};

export const OUTLINE_VIEWBOX = `${OUTLINE_BOUNDS.x} ${OUTLINE_BOUNDS.y} ${OUTLINE_BOUNDS.width} ${OUTLINE_BOUNDS.height}`;
