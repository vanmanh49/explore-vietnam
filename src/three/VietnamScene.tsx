import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { LITE_FRAME_RATE, QUALITY, SCENE } from '../config/constants';
import { Archipelagos } from './Archipelagos';
import { CameraController, INTRO_CAMERA_POSITION } from './CameraController';
import { Environment } from './Environment';
import { LocationMarkers } from './LocationMarkers';
import { PerformanceGovernor } from './PerformanceGovernor';
import type { VietnamSceneProps } from './sceneTypes';
import { Terrain } from './Terrain';
import { Water } from './Water';

/** Reports once the first frame has actually been drawn. */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const reported = useRef(false);
  useFrame(() => {
    if (reported.current) return;
    reported.current = true;
    onReady();
  });
  return null;
}

/** Draws at a fixed, lower frame rate. Used with `frameloop="demand"`. */
function FrameLimiter({ fps }: { fps: number }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const interval = 1000 / fps - 1;
    let frame = 0;
    let last = 0;
    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (time - last < interval) return;
      last = time;
      invalidate();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [fps, invalidate]);
  return null;
}

const DPR_STEP = 0.25;

function VietnamScene({
  view,
  focus,
  viewNonce,
  atmosphere,
  hoveredId,
  journeyProgress,
  quality,
  reducedMotion,
  interactive,
  paused,
  onHover,
  onSelect,
  onReady,
  onStruggle,
}: VietnamSceneProps) {
  const base = QUALITY[quality];
  const focusedId = focus.kind === 'destination' ? focus.id : null;

  const [minDpr, maxDpr] = base.dpr;
  const ceiling = Math.min(maxDpr, Math.max(minDpr, window.devicePixelRatio));
  const [dpr, setDpr] = useState(ceiling);
  /** Set once the device cannot hold its frame rate even at the lowest resolution. */
  const [lite, setLite] = useState(false);

  const settings = useMemo(
    () => (lite ? { ...base, particleCount: 0, cloudCount: 0 } : base),
    [base, lite],
  );

  // Each step down first lowers the resolution; once that is at its floor,
  // the scene drops its particles and clouds and halves its frame rate.
  const handleStepDown = () => {
    onStruggle();
    if (dpr > minDpr) setDpr(Math.max(minDpr, dpr - DPR_STEP));
    else setLite(true);
  };

  return (
    <Canvas
      flat
      dpr={dpr}
      frameloop={paused ? 'never' : lite ? 'demand' : 'always'}
      gl={{ antialias: settings.antialias, powerPreference: 'high-performance' }}
      camera={{ fov: SCENE.fov, near: 0.1, far: 300, position: INTRO_CAMERA_POSITION }}
      style={{ touchAction: interactive ? 'none' : 'pan-y' }}
      aria-label="3D map of Vietnam"
      role="img"
    >
      <Environment
        atmosphere={atmosphere}
        view={view}
        quality={settings}
        reducedMotion={reducedMotion}
      />
      <Terrain density={settings.terrainDensity} />
      <Archipelagos showLabels={view !== 'intro'} />
      <Water animated={!reducedMotion} />
      <LocationMarkers
        hoveredId={hoveredId}
        focusedId={focusedId}
        interactive={view !== 'intro'}
        reducedMotion={reducedMotion}
        onHover={onHover}
        onSelect={onSelect}
      />
      <CameraController
        view={view}
        focus={focus}
        viewNonce={viewNonce}
        journeyProgress={journeyProgress}
        interactive={interactive}
        reducedMotion={reducedMotion}
      />
      <ReadySignal onReady={onReady} />
      {lite ? (
        !paused && <FrameLimiter fps={LITE_FRAME_RATE} />
      ) : (
        <PerformanceGovernor onStepDown={handleStepDown} />
      )}
    </Canvas>
  );
}

export default memo(VietnamScene);
