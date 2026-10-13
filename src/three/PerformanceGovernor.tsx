import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const SAMPLE_MS = 1000;
/** Samples ignored after start-up or after a quality change, while things settle. */
const SETTLE_SAMPLES = 2;
/** Below this frame rate the scene counts as struggling. */
const LOW_FPS = 45;
/** Consecutive slow samples needed before stepping down, so one hitch is ignored. */
const SLOW_SAMPLES = 3;
/** A gap this long means the tab was hidden or the loop paused, not a slow frame. */
const PAUSE_GAP_MS = 400;

interface PerformanceGovernorProps {
  /** Asked to lower quality by one step. Never asked to raise it again. */
  onStepDown: () => void;
}

/**
 * Watches the real frame rate and asks for lower quality when the device
 * cannot keep up. Quality only ever goes down, so it cannot oscillate.
 */
export function PerformanceGovernor({ onStepDown }: PerformanceGovernorProps) {
  const state = useRef({ windowStart: 0, lastFrame: 0, frames: 0, settle: SETTLE_SAMPLES, slow: 0 });

  useFrame(() => {
    const now = performance.now();
    const s = state.current;

    if (now - s.lastFrame > PAUSE_GAP_MS) {
      // Resuming after a pause: start a fresh window.
      s.windowStart = now;
      s.frames = 0;
      s.settle = Math.max(s.settle, 1);
    }
    s.lastFrame = now;
    s.frames += 1;

    const elapsed = now - s.windowStart;
    if (elapsed < SAMPLE_MS) return;

    const fps = (s.frames * 1000) / elapsed;
    s.windowStart = now;
    s.frames = 0;

    if (s.settle > 0) {
      s.settle -= 1;
      return;
    }
    s.slow = fps < LOW_FPS ? s.slow + 1 : 0;
    if (s.slow >= SLOW_SAMPLES) {
      s.slow = 0;
      s.settle = SETTLE_SAMPLES;
      onStepDown();
    }
  });

  return null;
}
