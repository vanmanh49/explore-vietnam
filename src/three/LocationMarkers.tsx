import { Html } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { memo, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SCENE } from '../config/constants';
import { DESTINATIONS } from '../data/destinations';
import { project } from '../lib/geo';
import { hashString } from '../lib/noise';
import { surfaceHeightAt } from '../lib/terrain';
import type { Destination } from '../types';
import { getGlowTexture } from './textures';

const STEM_HEIGHT = 0.3;
const IDLE_COLOR = new THREE.Color(SCENE.markerColor);
const ACTIVE_COLOR = new THREE.Color(SCENE.markerActiveColor);

interface MarkerProps {
  destination: Destination;
  highlighted: boolean;
  interactive: boolean;
  reducedMotion: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

const Marker = memo(function Marker({
  destination,
  highlighted,
  interactive,
  reducedMotion,
  onHover,
  onSelect,
}: MarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lanternRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Sprite>(null);
  const lanternMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  const position = useMemo<[number, number, number]>(() => {
    const { x, z } = project(destination.coordinates);
    return [x, surfaceHeightAt(destination.coordinates), z];
  }, [destination.coordinates]);
  const phase = useMemo(() => (hashString(destination.id) % 1000) / 1000, [destination.id]);

  useFrame(({ camera, clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const blend = 1 - Math.exp(-delta * 10);

    // Keep markers legible from far away without towering when zoomed in.
    const distance = camera.position.distanceTo(group.position);
    const size = THREE.MathUtils.clamp(distance / 8, 0.75, 3) * (highlighted ? 1.3 : 1);
    group.scale.setScalar(group.scale.x + (size - group.scale.x) * blend);

    const time = reducedMotion ? 0 : clock.elapsedTime;
    if (lanternRef.current) {
      lanternRef.current.position.y = STEM_HEIGHT + Math.sin(time * 1.4 + phase * 6.28) * 0.018;
    }
    lanternMaterialRef.current?.color.lerp(highlighted ? ACTIVE_COLOR : IDLE_COLOR, blend);
    if (haloRef.current) {
      const target = highlighted ? 0.75 : 0.42;
      const next = haloRef.current.scale.x + (target - haloRef.current.scale.x) * blend;
      haloRef.current.scale.set(next, next, 1);
    }
    if (ringRef.current) {
      const pulse = reducedMotion ? 0.35 : (time * 0.45 + phase) % 1;
      ringRef.current.scale.setScalar(1 + pulse * 1.9);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - pulse) * 0.7;
    }
  });

  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    if (!interactive) return;
    event.stopPropagation();
    onHover(destination.id);
    document.body.style.cursor = 'pointer';
  };
  const handleOut = () => {
    onHover(null);
    document.body.style.cursor = '';
  };
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!interactive) return;
    event.stopPropagation();
    onSelect(destination.id);
  };

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={ringRef} rotation-x={-Math.PI / 2} position-y={0.012} renderOrder={2}>
        <ringGeometry args={[0.06, 0.075, 32]} />
        <meshBasicMaterial
          color={SCENE.markerColor}
          transparent
          depthWrite={false}
          toneMapped={false}
          fog={false}
        />
      </mesh>

      <mesh position-y={STEM_HEIGHT / 2}>
        <cylinderGeometry args={[0.004, 0.004, STEM_HEIGHT, 5]} />
        <meshBasicMaterial color="#eef1ea" transparent opacity={0.7} fog={false} />
      </mesh>

      <group ref={lanternRef} position-y={STEM_HEIGHT}>
        <mesh scale={[1, 1.25, 1]}>
          <sphereGeometry args={[0.05, 14, 10]} />
          <meshBasicMaterial ref={lanternMaterialRef} color={SCENE.markerColor} fog={false} />
        </mesh>
        <sprite ref={haloRef} scale={[0.42, 0.42, 1]} renderOrder={3}>
          <spriteMaterial
            map={getGlowTexture()}
            color={SCENE.markerColor}
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            fog={false}
          />
        </sprite>
      </group>

      {/* Generous invisible hit area so markers are easy to hover and tap. */}
      <mesh
        position-y={STEM_HEIGHT * 0.7}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {highlighted && (
        <Html center position={[0, STEM_HEIGHT + 0.26, 0]} zIndexRange={[5, 0]} className="marker-label">
          <span>{destination.name}</span>
        </Html>
      )}
    </group>
  );
});

interface LocationMarkersProps {
  hoveredId: string | null;
  focusedId: string | null;
  interactive: boolean;
  reducedMotion: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

export function LocationMarkers({
  hoveredId,
  focusedId,
  interactive,
  reducedMotion,
  onHover,
  onSelect,
}: LocationMarkersProps) {
  // Never leave a pointer cursor behind when the scene unmounts.
  useEffect(
    () => () => {
      document.body.style.cursor = '';
    },
    [],
  );

  return (
    <group>
      {DESTINATIONS.map((destination) => (
        <Marker
          key={destination.id}
          destination={destination}
          highlighted={destination.id === hoveredId || destination.id === focusedId}
          interactive={interactive}
          reducedMotion={reducedMotion}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
