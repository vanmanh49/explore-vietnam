import { Html } from '@react-three/drei';
import { memo, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { ARCHIPELAGOS } from '../data/archipelagos';
import { project } from '../lib/geo';
import { seededRandom } from '../lib/noise';

const ISLETS = ARCHIPELAGOS.flatMap((archipelago) => archipelago.islets);

interface IsletLayer {
  color: string;
  radius: number;
  height: number;
}

/** A sand skirt with a green cap on top. */
const LAYERS: IsletLayer[] = [
  { color: '#e6d6a8', radius: 0.085, height: 0.016 },
  { color: '#6fa56c', radius: 0.05, height: 0.034 },
];

function buildLayer(layer: IsletLayer): THREE.InstancedMesh {
  const geometry = new THREE.ConeGeometry(layer.radius, layer.height, 7);
  geometry.translate(0, layer.height / 2, 0);
  const material = new THREE.MeshStandardMaterial({
    color: layer.color,
    flatShading: true,
    roughness: 1,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, ISLETS.length);
  // The same seed for every layer keeps cap and skirt the same size.
  const random = seededRandom(1975);
  const matrix = new THREE.Matrix4();
  const rotation = new THREE.Quaternion();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  ISLETS.forEach((islet, index) => {
    const { x, z } = project(islet);
    const size = 0.75 + random() * 0.6;
    position.set(x, 0, z);
    rotation.setFromAxisAngle(up, random() * Math.PI);
    scale.set(size, 1, size);
    mesh.setMatrixAt(index, matrix.compose(position, rotation, scale));
  });
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

interface ArchipelagosProps {
  showLabels: boolean;
}

/** The Hoàng Sa and Trường Sa archipelagos. */
export const Archipelagos = memo(function Archipelagos({ showLabels }: ArchipelagosProps) {
  const layers = useMemo(() => LAYERS.map(buildLayer), []);

  useEffect(
    () => () => {
      layers.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
    },
    [layers],
  );

  return (
    <group>
      {layers.map((mesh, index) => (
        <primitive key={index} object={mesh} />
      ))}
      {showLabels &&
        ARCHIPELAGOS.map((archipelago) => {
          const { x, z } = project(archipelago.labelAt);
          return (
            <Html
              key={archipelago.id}
              center
              position={[x, 0.05, z]}
              zIndexRange={[3, 0]}
              className="archipelago-label"
            >
              <span lang="vi">{archipelago.name}</span>
            </Html>
          );
        })}
    </group>
  );
});
