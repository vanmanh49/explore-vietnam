import { VIETNAM_OUTLINE } from '../data/vietnamOutline';
import type { LonLat } from '../types';

/**
 * Geography helpers. The scene uses one unit per degree of latitude, with
 * north pointing towards -Z and east towards +X.
 */

export interface MapPoint {
  x: number;
  z: number;
}

export const MAP_ORIGIN: LonLat = [105.8, 15.9];
const LON_SCALE = Math.cos((MAP_ORIGIN[1] * Math.PI) / 180);

/** Geographic bounds covered by the terrain mesh. */
export const MAP_BOUNDS = { west: 101.4, east: 110.2, south: 7.8, north: 24.0 };

export function project([lon, lat]: LonLat): MapPoint {
  return { x: (lon - MAP_ORIGIN[0]) * LON_SCALE, z: -(lat - MAP_ORIGIN[1]) };
}

interface Ring {
  points: MapPoint[];
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

/** Islands smaller than this are enlarged so they survive the terrain grid. */
const MIN_ISLAND_SIZE = 0.3;

function buildRing(outline: LonLat[]): Ring {
  let points = outline.map(project);
  const xs = points.map((p) => p.x);
  const zs = points.map((p) => p.z);
  let minX = Math.min(...xs);
  let maxX = Math.max(...xs);
  let minZ = Math.min(...zs);
  let maxZ = Math.max(...zs);
  const size = Math.max(maxX - minX, maxZ - minZ);
  if (size < MIN_ISLAND_SIZE) {
    const scale = MIN_ISLAND_SIZE / size;
    const cx = (minX + maxX) / 2;
    const cz = (minZ + maxZ) / 2;
    points = points.map((p) => ({ x: cx + (p.x - cx) * scale, z: cz + (p.z - cz) * scale }));
    minX = cx + (minX - cx) * scale;
    maxX = cx + (maxX - cx) * scale;
    minZ = cz + (minZ - cz) * scale;
    maxZ = cz + (maxZ - cz) * scale;
  }
  return { points, minX, maxX, minZ, maxZ };
}

const RINGS: Ring[] = VIETNAM_OUTLINE.map(buildRing);

/** Projected land outlines, for 2D rendering. */
export const LAND_RINGS: MapPoint[][] = RINGS.map((ring) => ring.points);

function ringContains(ring: Ring, x: number, z: number): boolean {
  if (x < ring.minX || x > ring.maxX || z < ring.minZ || z > ring.maxZ) return false;
  const { points } = ring;
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const a = points[i]!;
    const b = points[j]!;
    if (a.z > z !== b.z > z && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

function ringDistanceSq(ring: Ring, x: number, z: number, best: number): number {
  // Skip rings whose bounding box is already further than the best distance.
  const dx = Math.max(ring.minX - x, 0, x - ring.maxX);
  const dz = Math.max(ring.minZ - z, 0, z - ring.maxZ);
  if (dx * dx + dz * dz >= best) return best;

  const { points } = ring;
  let min = best;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const a = points[j]!;
    const b = points[i]!;
    const ex = b.x - a.x;
    const ez = b.z - a.z;
    const lengthSq = ex * ex + ez * ez;
    let t = lengthSq === 0 ? 0 : ((x - a.x) * ex + (z - a.z) * ez) / lengthSq;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const px = a.x + ex * t - x;
    const pz = a.z + ez * t - z;
    const d = px * px + pz * pz;
    if (d < min) min = d;
  }
  return min;
}

/**
 * Distance from a point to the nearest coastline or border.
 * Positive on land, negative at sea.
 */
export function signedShoreDistance(x: number, z: number): number {
  let best = Infinity;
  let inside = false;
  for (const ring of RINGS) {
    best = ringDistanceSq(ring, x, z, best);
    if (!inside && ringContains(ring, x, z)) inside = true;
  }
  const distance = Math.sqrt(best);
  return inside ? distance : -distance;
}

export function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
