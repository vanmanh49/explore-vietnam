import { useEffect, useState } from 'react';
import { LOADING_TIMEOUT_MS } from '../config/constants';

const MIN_VISIBLE_MS = 700;
const TICK_MS = 120;

interface LoadingProgress {
  /** 0..1 */
  progress: number;
  done: boolean;
}

/**
 * Drives the loading screen. Progress eases towards 90% while the 3D scene
 * downloads and builds, then completes when the first frame is drawn. A
 * timeout guarantees the screen never blocks the site.
 */
export function useLoadingProgress(ready: boolean): LoadingProgress {
  const [progress, setProgress] = useState(0.08);
  const [done, setDone] = useState(false);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const minimum = window.setTimeout(() => setMinimumElapsed(true), MIN_VISIBLE_MS);
    const timeout = window.setTimeout(() => setTimedOut(true), LOADING_TIMEOUT_MS);
    return () => {
      window.clearTimeout(minimum);
      window.clearTimeout(timeout);
    };
  }, []);

  const finished = (ready && minimumElapsed) || timedOut;

  useEffect(() => {
    if (finished) {
      setProgress(1);
      const hide = window.setTimeout(() => setDone(true), 350);
      return () => window.clearTimeout(hide);
    }
    const tick = window.setInterval(
      () => setProgress((value) => value + (0.9 - value) * 0.09),
      TICK_MS,
    );
    return () => window.clearInterval(tick);
  }, [finished]);

  return { progress, done };
}
