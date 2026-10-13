import { memo, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { SCENE } from '../config/constants';
import { MAP_BOUNDS, project, signedShoreDistance, smoothstep } from '../lib/geo';
import { fbm, seededRandom } from '../lib/noise';
import { TERRAIN, sampleTerrain, type TerrainSample } from '../lib/terrain';

const PALETTE = {
  deep: new THREE.Color(SCENE.waterDeep),
  shallow: new THREE.Color('#7fd2c2'),
  sand: new THREE.Color('#e6d6a8'),
  paddy: new THREE.Color('#8fbf6c'),
  ripeRice: new THREE.Color('#c3c96c'),
  forest: new THREE.Color('#3f8460'),
  highForest: new THREE.Color('#2b6157'),
  rock: new THREE.Color('#7f8e84'),
  peak: new THREE.Color('#dedccd'),
};

function shade(sample: TerrainSample, x: number, z: number, out: THREE.Color): void {
  if (sample.height <= 0) {
    out.copy(PALETTE.shallow).lerp(PALETTE.deep, smoothstep(0, 0.2, -sample.height));
    return;
  }
  if (sample.shore < 0.035) {
    out.copy(PALETTE.sand);
    return;
  }
  const t = sample.height / TERRAIN.maxHeight;
  out
    .copy(PALETTE.paddy)
    .lerp(PALETTE.ripeRice, fbm(x * 3.1, z * 3.1, 2) * 0.7)
    .lerp(PALETTE.forest, smoothstep(0.03, 0.14, t))
    .lerp(PALETTE.highForest, smoothstep(0.14, 0.4, t))
    .lerp(PALETTE.rock, smoothstep(0.46, 0.72, t))
    .lerp(PALETTE.peak, smoothstep(0.74, 1, t));
}

function buildTerrainGeometry(density: number): THREE.BufferGeometry {
  const northWest = project([MAP_BOUNDS.west, MAP_BOUNDS.north]);
  const southEast = project([MAP_BOUNDS.east, MAP_BOUNDS.south]);
  const width = southEast.x - northWest.x;
  const depth = southEast.z - northWest.z;
  const columns = Math.ceil(width * density);
  const rows = Math.ceil(depth * density);

  const vertexCount = (columns + 1) * (rows + 1);
  const positions = new Float32Array(vertexCount * 3);
  const colors = new Float32Array(vertexCount * 3);
  const color = new THREE.Color();

  let offset = 0;
  for (let row = 0; row <= rows; row += 1) {
    const z = northWest.z + (row / rows) * depth;
    for (let column = 0; column <= columns; column += 1) {
      const x = northWest.x + (column / columns) * width;
      const sample = sampleTerrain(x, z);
      positions[offset] = x;
      positions[offset + 1] = sample.height;
      positions[offset + 2] = z;
      shade(sample, x, z, color);
      colors[offset] = color.r;
      colors[offset + 1] = color.g;
      colors[offset + 2] = color.b;
      offset += 3;
    }
  }

  const indices = new Uint32Array(columns * rows * 6);
  let index = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const a = row * (columns + 1) + column;
      const b = a + 1;
      const c = a + columns + 1;
      const d = c + 1;
      // Alternate the diagonal so the facets do not all lean the same way.
      if ((row + column) % 2 === 0) {
        indices.set([a, c, b, b, c, d], index);
      } else {
        indices.set([a, c, d, a, d, b], index);
      }
      index += 6;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  return geometry;
}

const KARST_COUNT = 36;
const KARST_CENTER = project([107.3, 20.72]);
const KARST_SPREAD = 0.55;

/** Limestone islets scattered across Ha Long Bay. */
function buildKarsts(): THREE.InstancedMesh {
  const geometry = new THREE.ConeGeometry(0.034, 0.07, 6);
  geometry.translate(0, 0.035, 0);
  const material = new THREE.MeshStandardMaterial({
    color: '#6f9a82',
    flatShading: true,
    roughness: 1,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, KARST_COUNT);
  const random = seededRandom(1994);
  const matrix = new THREE.Matrix4();
  const rotation = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const position = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  let placed = 0;
  let attempts = 0;
  while (placed < KARST_COUNT && attempts < 2000) {
    attempts += 1;
    const x = KARST_CENTER.x + (random() - 0.5) * 2 * KARST_SPREAD;
    const z = KARST_CENTER.z + (random() - 0.5) * 2 * KARST_SPREAD;
    const shore = signedShoreDistance(x, z);
    if (shore > -0.02 || shore < -0.4) continue;
    const size = 0.6 + random() * 1.1;
    position.set(x, -0.005, z);
    rotation.setFromAxisAngle(up, random() * Math.PI);
    scale.set(size, size * (0.5 + random() * 0.6), size);
    mesh.setMatrixAt(placed, matrix.compose(position, rotation, scale));
    placed += 1;
  }
  mesh.count = placed;
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

interface TerrainProps {
  /** Grid cells per degree. Lower values build faster and render cheaper. */
  density: number;
}

export const Terrain = memo(function Terrain({ density }: TerrainProps) {
  const geometry = useMemo(() => buildTerrainGeometry(density), [density]);
  const karsts = useMemo(buildKarsts, []);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(
    () => () => {
      karsts.geometry.dispose();
      (karsts.material as THREE.Material).dispose();
    },
    [karsts],
  );

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial vertexColors flatShading roughness={0.95} metalness={0} />
      </mesh>
      {/* Sea floor beyond the terrain mesh, so its rectangular edge never shows. */}
      <mesh rotation-x={-Math.PI / 2} position-y={TERRAIN.seaFloor - 0.01}>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color={SCENE.waterDeep} roughness={0.95} metalness={0} />
      </mesh>
      <primitive object={karsts} />
    </group>
  );
});
