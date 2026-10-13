import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { SCENE } from '../config/constants';
import { DESTINATION_BY_ID } from '../data/destinations';
import { REGIONS, REGION_BY_ID } from '../data/regions';
import { project } from '../lib/geo';
import { surfaceHeightAt } from '../lib/terrain';
import type { MapFocus } from '../types';
import type { SceneView } from './sceneTypes';

interface Pose {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

const DEG = Math.PI / 180;
/** Fraction of the camera distance visible vertically at the target. */
const VIEW_SPAN = 2 * Math.tan((SCENE.fov / 2) * DEG);
/** Aspect ratio above which a side panel covers the left of the map. */
const SIDE_PANEL_ASPECT = 1.3;

export const INTRO_CAMERA_POSITION: [number, number, number] = [5.2, 1.55, -1.2];

const REGION_TARGETS = REGIONS.map((region) => {
  const { x, z } = project(region.focus);
  return new THREE.Vector3(x, 0.15, z);
});

/** Places the camera on a sphere around the target. */
function orbit(pose: Pose, distance: number, pitch: number, yaw: number): void {
  pose.position.set(
    pose.target.x + distance * Math.sin(yaw * DEG) * Math.cos(pitch * DEG),
    pose.target.y + distance * Math.sin(pitch * DEG),
    pose.target.z + distance * Math.cos(yaw * DEG) * Math.cos(pitch * DEG),
  );
}

/** Looks slightly left of the subject so it sits clear of the side panel. */
function panelShift(distance: number, aspect: number): number {
  return aspect > SIDE_PANEL_ASPECT ? distance * VIEW_SPAN * aspect * 0.11 : 0;
}

function explorePose(pose: Pose, focus: MapFocus, aspect: number): void {
  const portrait = aspect < 1;
  if (focus.kind === 'destination') {
    const destination = DESTINATION_BY_ID.get(focus.id);
    if (destination) {
      const { x, z } = project(destination.coordinates);
      const distance = portrait ? 5.6 : 4.6;
      pose.target.set(x - panelShift(distance, aspect), surfaceHeightAt(destination.coordinates), z);
      orbit(pose, distance, 36, 14);
      return;
    }
  }
  if (focus.kind === 'region') {
    const { x, z } = project(REGION_BY_ID[focus.region].focus);
    const distance = portrait ? 14 : 12;
    pose.target.set(x - panelShift(distance, aspect), 0, z);
    orbit(pose, distance, 47, 8);
    return;
  }
  // Overview: fit the whole country, which is roughly 15.5 long.
  // The offshore archipelagos reach about 9.5 units east of the map origin.
  const distance = Math.max(28, 15.8 / (VIEW_SPAN * aspect));
  const centerX = aspect > SIDE_PANEL_ASPECT ? -panelShift(distance, aspect) : 3.1;
  // In portrait a bottom sheet covers the south, so frame the map higher up.
  pose.target.set(centerX, 0, portrait ? 3.4 : 0.5);
  orbit(pose, distance, 56, 0);
}

function introPose(pose: Pose, time: number, aspect: number): void {
  const pullBack = aspect < 1 ? 1.6 : 0;
  pose.position.set(
    INTRO_CAMERA_POSITION[0] + pullBack + Math.sin(time * 0.07) * 0.5,
    INTRO_CAMERA_POSITION[1] + pullBack * 0.25 + Math.sin(time * 0.11) * 0.1,
    INTRO_CAMERA_POSITION[2] + Math.cos(time * 0.05) * 0.4,
  );
  pose.target.set(-0.8, 0.3, -5.6);
}

function journeyPose(pose: Pose, progress: number, aspect: number): void {
  const scaled = THREE.MathUtils.clamp(progress, 0, 1) * (REGION_TARGETS.length - 1);
  const index = Math.min(Math.floor(scaled), REGION_TARGETS.length - 2);
  const local = THREE.MathUtils.smoothstep(scaled - index, 0, 1);
  pose.target.lerpVectors(REGION_TARGETS[index]!, REGION_TARGETS[index + 1]!, local);
  // Fly down the coast, looking inland from over the East Sea.
  if (aspect < 1) pose.position.set(pose.target.x + 6.4, 3.6, pose.target.z + 4.8);
  else pose.position.set(pose.target.x + 5.2, 2.1, pose.target.z + 4.4);
  // Leave room for the story panel in the lower half of the screen.
  pose.target.y -= aspect < 1 ? 1.4 : 0.9;
}

interface CameraControllerProps {
  view: SceneView;
  focus: MapFocus;
  viewNonce: number;
  journeyProgress: RefObject<number>;
  interactive: boolean;
  reducedMotion: boolean;
}

export function CameraController({
  view,
  focus,
  viewNonce,
  journeyProgress,
  interactive,
  reducedMotion,
}: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const gl = useThree((state) => state.gl);
  const pose = useRef<Pose>({ position: new THREE.Vector3(), target: new THREE.Vector3() });
  const lookAt = useRef(new THREE.Vector3(-0.8, 0.3, -5.6));
  /** True while the camera is being flown to a new pose in explore mode. */
  const flying = useRef(false);

  useEffect(() => {
    flying.current = true;
  }, [view, focus, viewNonce]);

  // Let the page scroll under a touch unless the visitor has taken the map.
  useEffect(() => {
    gl.domElement.style.touchAction = interactive ? 'none' : 'pan-y';
  }, [gl, interactive]);

  useFrame(({ camera, clock, size }, delta) => {
    const driven = view !== 'explore';
    if (!driven && !flying.current) {
      // The visitor is steering: remember where they are looking.
      if (controlsRef.current) lookAt.current.copy(controlsRef.current.target);
      return;
    }

    const aspect = size.width / size.height;
    const current = pose.current;
    if (view === 'intro') introPose(current, reducedMotion ? 0 : clock.elapsedTime, aspect);
    else if (view === 'journey') journeyPose(current, journeyProgress.current ?? 0, aspect);
    else explorePose(current, focus, aspect);

    const blend = reducedMotion ? 1 : 1 - Math.exp(-delta * (driven ? 2.4 : 3));
    camera.position.lerp(current.position, blend);
    lookAt.current.lerp(current.target, blend);
    camera.lookAt(lookAt.current);
    controlsRef.current?.target.copy(lookAt.current);

    if (!driven && camera.position.distanceToSquared(current.position) < 0.0004) {
      flying.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={interactive}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      zoomSpeed={0.8}
      minDistance={SCENE.zoom.min}
      maxDistance={SCENE.zoom.max}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI * 0.44}
      onStart={() => {
        flying.current = false;
      }}
    />
  );
}
