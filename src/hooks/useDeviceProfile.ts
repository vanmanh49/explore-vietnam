import { useMemo } from 'react';
import type { QualityTier } from '../types';
import { useMediaQuery } from './useMediaQuery';

export interface DeviceProfile {
  quality: QualityTier;
  reducedMotion: boolean;
  /** Touch-first device: no hover, and dragging the map competes with scrolling. */
  coarsePointer: boolean;
  compactLayout: boolean;
}

export function useDeviceProfile(): DeviceProfile {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const coarsePointer = useMediaQuery('(pointer: coarse)');
  const compactLayout = useMediaQuery('(max-width: 1023px)');

  return useMemo(() => {
    const fewCores = (navigator.hardwareConcurrency ?? 8) <= 4;
    // Chromium only; other browsers report nothing and are judged on the rest.
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const quality: QualityTier =
      coarsePointer || compactLayout || fewCores || memory <= 4 ? 'low' : 'high';
    return { quality, reducedMotion, coarsePointer, compactLayout };
  }, [reducedMotion, coarsePointer, compactLayout]);
}
