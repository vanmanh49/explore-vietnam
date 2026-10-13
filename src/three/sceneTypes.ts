import type { RefObject } from 'react';
import type { MapFocus, QualityTier, RegionId } from '../types';

/** Which camera behaviour is active. */
export type SceneView = 'intro' | 'explore' | 'journey';

export interface VietnamSceneProps {
  view: SceneView;
  focus: MapFocus;
  /** Bumped to replay the camera move to the current focus. */
  viewNonce: number;
  atmosphere: RegionId;
  hoveredId: string | null;
  /** Scroll progress through the north-to-south journey, 0..1. */
  journeyProgress: RefObject<number>;
  quality: QualityTier;
  reducedMotion: boolean;
  /** Whether the visitor can orbit, zoom and pan. */
  interactive: boolean;
  paused: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onReady: () => void;
  /** Called when the measured frame rate first drops below target. */
  onStruggle: () => void;
}
