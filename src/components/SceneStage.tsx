import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { DESTINATION_BY_ID } from '../data/destinations';
import { useExplore } from '../context/ExploreContext';
import { useDeviceProfile } from '../hooks/useDeviceProfile';
import { isWebGLAvailable } from '../lib/dom';
import type { SceneView } from '../three/sceneTypes';
import type { RegionId } from '../types';
import { ErrorBoundary } from './ErrorBoundary';
import { MapFallback } from './MapFallback';

// Three.js and the scene are the heaviest part of the site: load them apart.
const VietnamScene = lazy(() => import('../three/VietnamScene'));

interface SceneStageProps {
  onReady: () => void;
}

/** Fixed backdrop that hosts the 3D map, or a flat map when 3D is unavailable. */
export function SceneStage({ onReady }: SceneStageProps) {
  const {
    mode,
    focus,
    viewNonce,
    hoveredId,
    journey,
    journeyProgress,
    sceneVisible,
    touchUnlocked,
    activeDestination,
    setHoveredId,
    openDestination,
  } = useExplore();
  const device = useDeviceProfile();
  const [unavailable, setUnavailable] = useState(() => !isWebGLAvailable());
  const [hasRendered, setHasRendered] = useState(false);
  /** True once the scene has reported a low frame rate on this device. */
  const [struggling, setStruggling] = useState(false);
  const handleStruggle = useCallback(() => setStruggling(true), []);

  // Frosted-glass blur over a live canvas is costly: the stylesheet drops it
  // for devices that start out weak or turn out to be.
  const lightweight = device.quality === 'low' || struggling;
  useEffect(() => {
    document.documentElement.dataset.quality = lightweight ? 'low' : 'high';
  }, [lightweight]);

  const handleReady = useCallback(() => {
    setHasRendered(true);
    onReady();
  }, [onReady]);

  useEffect(() => {
    if (unavailable) onReady();
  }, [unavailable, onReady]);

  const view: SceneView = journey.active ? 'journey' : mode;

  let atmosphere: RegionId = 'north';
  if (journey.active) atmosphere = journey.region;
  else if (focus.kind === 'region') atmosphere = focus.region;
  else if (focus.kind === 'destination') {
    atmosphere = DESTINATION_BY_ID.get(focus.id)?.region ?? 'north';
  }

  const fallback = (
    <MapFallback
      hoveredId={hoveredId}
      interactive={mode === 'explore'}
      onHover={setHoveredId}
      onSelect={openDestination}
    />
  );

  return (
    <div
      className="fixed inset-0 z-0 bg-ink-deep"
      style={{ visibility: sceneVisible ? 'visible' : 'hidden' }}
    >
      {unavailable ? (
        fallback
      ) : (
        <ErrorBoundary fallback={fallback} onError={() => setUnavailable(true)}>
          <Suspense fallback={null}>
            <VietnamScene
              view={view}
              focus={focus}
              viewNonce={viewNonce}
              atmosphere={atmosphere}
              hoveredId={hoveredId}
              journeyProgress={journeyProgress}
              quality={device.quality}
              reducedMotion={device.reducedMotion}
              interactive={view === 'explore' && (!device.coarsePointer || touchUnlocked)}
              // Always draw the first frame, even when a detail view opens on arrival.
              paused={hasRendered && (!sceneVisible || activeDestination !== null)}
              onHover={setHoveredId}
              onSelect={openDestination}
              onReady={handleReady}
              onStruggle={handleStruggle}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
