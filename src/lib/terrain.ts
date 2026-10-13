import type { LonLat } from '../types';
import { project, signedShoreDistance, smoothstep } from './geo';
import { fbm } from './noise';

/**
 * Stylised elevation model. Mountain ranges are described as soft blobs
 * placed on the real highlands; noise turns them into ridges. The river
 * deltas are left flat.
 */

interface Massif {
  at: LonLat;
  radius: number;
  height: number;
}

const MASSIFS: Massif[] = [
  // Hoàng Liên Sơn and the northern frontier
  { at: [103.8, 22.3], radius: 0.9, height: 1 },
  { at: [103.2, 21.6], radius: 0.9, height: 0.8 },
  { at: [104.6, 21.4], radius: 0.9, height: 0.6 },
  { at: [105.1, 22.8], radius: 0.8, height: 0.85 },
  { at: [106.1, 22.5], radius: 0.8, height: 0.55 },
  { at: [107.0, 21.7], radius: 0.6, height: 0.35 },
  // Trường Sơn range along the western border
  { at: [104.6, 19.7], radius: 0.8, height: 0.7 },
  { at: [105.2, 18.7], radius: 0.5, height: 0.6 },
  { at: [105.9, 17.8], radius: 0.45, height: 0.6 },
  { at: [106.6, 16.9], radius: 0.4, height: 0.55 },
  { at: [107.3, 16.1], radius: 0.5, height: 0.6 },
  // Central Highlands
  { at: [107.8, 15.2], radius: 0.7, height: 0.8 },
  { at: [108.1, 14.2], radius: 0.8, height: 0.7 },
  { at: [108.3, 13.1], radius: 0.8, height: 0.6 },
  { at: [108.5, 12.1], radius: 0.7, height: 0.75 },
  { at: [107.7, 11.7], radius: 0.6, height: 0.45 },
];

const MASSIF_POINTS = MASSIFS.map((massif) => ({ ...massif, ...project(massif.at) }));

export const TERRAIN = {
  maxHeight: 0.95,
  seaFloor: -0.3,
  /** Width of the band over which land rises from the shoreline. */
  coastWidth: 0.12,
  /** Distance inland at which mountains reach their full height. */
  foothillWidth: 0.42,
} as const;

export interface TerrainSample {
  height: number;
  /** Signed distance to the shore: positive on land. */
  shore: number;
  /** 0..1 strength of the mountain mask at this point. */
  relief: number;
}

export function sampleTerrain(x: number, z: number): TerrainSample {
  const shore = signedShoreDistance(x, z);
  if (shore <= 0) {
    return { height: Math.max(TERRAIN.seaFloor, shore * 1.6), shore, relief: 0 };
  }

  let relief = 0;
  for (const massif of MASSIF_POINTS) {
    const dx = x - massif.x;
    const dz = z - massif.z;
    relief += massif.height * Math.exp(-(dx * dx + dz * dz) / (massif.radius * massif.radius));
  }
  relief = Math.min(1.15, relief);

  const land = smoothstep(0, TERRAIN.coastWidth, shore);
  const ridges = 1 - Math.abs(2 * fbm(x * 1.9 + 11.3, z * 1.9 - 4.1, 4) - 1);
  const hills = fbm(x * 4.5 - 2.7, z * 4.5 + 8.9, 3);
  // Mountains build up gradually from the edge so borders do not end in cliffs.
  const inland = smoothstep(0, TERRAIN.foothillWidth, shore);
  const height =
    land * (0.018 + hills * 0.035) +
    inland * relief * (0.22 + 0.78 * ridges) * TERRAIN.maxHeight;

  return { height, shore, relief };
}

/** Height of the visible surface (land or sea level) at a geographic point. */
export function surfaceHeightAt(coordinates: LonLat): number {
  const { x, z } = project(coordinates);
  return Math.max(0, sampleTerrain(x, z).height);
}
