import type { LonLat } from '../types';

export interface Archipelago {
  id: string;
  name: string;
  /** Where the name is anchored on the map. */
  labelAt: LonLat;
  /** Approximate positions of the main islands and reefs. */
  islets: LonLat[];
}

/**
 * Offshore archipelagos in the East Sea. They lie beyond the terrain mesh,
 * so the maps draw them as individual islets.
 */
export const ARCHIPELAGOS: Archipelago[] = [
  {
    id: 'hoang-sa',
    name: 'Hoàng Sa',
    labelAt: [112.0, 16.45],
    islets: [
      [112.33, 16.83],
      [112.27, 16.98],
      [112.73, 16.67],
      [111.2, 15.78],
      [111.6, 16.53],
      [111.7, 16.45],
      [111.77, 16.05],
      [112.5, 16.03],
    ],
  },
  {
    id: 'truong-sa',
    name: 'Trường Sa',
    labelAt: [113.6, 9.55],
    islets: [
      [111.92, 8.64],
      [114.33, 11.43],
      [114.28, 11.05],
      [114.42, 10.67],
      [114.37, 10.38],
      [114.37, 10.18],
      [114.33, 9.88],
      [114.57, 9.9],
      [115.53, 9.9],
      [112.89, 9.55],
      [113.7, 8.97],
      [112.6, 8.93],
      [112.23, 8.85],
      [113.3, 8.17],
      [112.92, 7.89],
    ],
  },
];
