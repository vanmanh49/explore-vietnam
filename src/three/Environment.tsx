import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ATMOSPHERES, SCENE, type QualitySettings } from '../config/constants';
import { seededRandom } from '../lib/noise';
import type { RegionId } from '../types';
import type { SceneView } from './sceneTypes';
import { getCloudTexture, getGlowTexture } from './textures';

const SUN_DIRECTION = new THREE.Vector3(...SCENE.sunDirection).normalize();

/** Fog range and cloud opacity for each camera mode. */
const VIEW_SETTINGS: Record<SceneView, { fogNear: number; fogFar: number; clouds: number }> = {
  intro: { fogNear: 4, fogFar: 24, clouds: 0.5 },
  journey: { fogNear: 6, fogFar: 30, clouds: 0.38 },
  explore: { fogNear: 32, fogFar: 95, clouds: 0.14 },
};

const SKY_VERTEX = /* glsl */ `
  varying vec3 vDirection;
  void main() {
    vDirection = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAGMENT = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uGlow;
  uniform vec3 uHaze;
  uniform vec3 uSun;
  uniform vec3 uSunDirection;
  varying vec3 vDirection;

  void main() {
    vec3 direction = normalize(vDirection);
    float height = direction.y;
    vec3 color = mix(uHaze, uGlow, smoothstep(-0.01, 0.09, height));
    color = mix(color, uTop, smoothstep(0.06, 0.6, height));
    float sun = max(dot(direction, uSunDirection), 0.0);
    color += uSun * (pow(sun, 18.0) * 0.28 + pow(sun, 600.0) * 0.9);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

interface Cloud {
  position: [number, number, number];
  scale: [number, number, number];
  speed: number;
}

const CLOUD_RANGE_X = 9;

function createClouds(count: number): Cloud[] {
  const random = seededRandom(54);
  return Array.from({ length: count }, () => {
    const width = 2.2 + random() * 2.6;
    return {
      position: [
        (random() - 0.5) * 2 * CLOUD_RANGE_X,
        1.5 + random() * 1.2,
        (random() - 0.5) * 19,
      ],
      scale: [width, width * 0.42, 1],
      speed: 0.03 + random() * 0.05,
    };
  });
}

function createParticlePositions(count: number): Float32Array {
  const random = seededRandom(1010);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (random() - 0.5) * 11;
    positions[i * 3 + 1] = 0.12 + random() * 2.4;
    positions[i * 3 + 2] = (random() - 0.5) * 18;
  }
  return positions;
}

interface EnvironmentProps {
  atmosphere: RegionId;
  view: SceneView;
  quality: QualitySettings;
  reducedMotion: boolean;
}

export function Environment({ atmosphere, view, quality, reducedMotion }: EnvironmentProps) {
  const scene = useThree((state) => state.scene);
  const skyRef = useRef<THREE.Mesh>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const cloudGroupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const targets = useMemo(() => {
    const palette = ATMOSPHERES[atmosphere];
    return {
      top: new THREE.Color(palette.skyTop),
      glow: new THREE.Color(palette.skyGlow),
      haze: new THREE.Color(palette.haze),
      sun: new THREE.Color(palette.sun),
    };
  }, [atmosphere]);

  const skyMaterial = useMemo(() => {
    const initial = ATMOSPHERES.north;
    return new THREE.ShaderMaterial({
      vertexShader: SKY_VERTEX,
      fragmentShader: SKY_FRAGMENT,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
      fog: false,
      uniforms: {
        uTop: { value: new THREE.Color(initial.skyTop) },
        uGlow: { value: new THREE.Color(initial.skyGlow) },
        uHaze: { value: new THREE.Color(initial.haze) },
        uSun: { value: new THREE.Color(initial.sun) },
        uSunDirection: { value: SUN_DIRECTION },
      },
    });
  }, []);

  const fog = useMemo(
    () => new THREE.Fog(ATMOSPHERES.north.haze, VIEW_SETTINGS.intro.fogNear, VIEW_SETTINGS.intro.fogFar),
    [],
  );

  const clouds = useMemo(() => createClouds(quality.cloudCount), [quality.cloudCount]);
  const cloudMaterial = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: getCloudTexture(),
        transparent: true,
        depthWrite: false,
        opacity: VIEW_SETTINGS.intro.clouds,
      }),
    [],
  );

  const particlePositions = useMemo(
    () => createParticlePositions(quality.particleCount),
    [quality.particleCount],
  );

  useFrame(({ camera, clock }, delta) => {
    const blend = reducedMotion ? 1 : 1 - Math.exp(-delta * 1.6);
    const settings = VIEW_SETTINGS[view];
    const uniforms = skyMaterial.uniforms;

    (uniforms.uTop!.value as THREE.Color).lerp(targets.top, blend);
    (uniforms.uGlow!.value as THREE.Color).lerp(targets.glow, blend);
    (uniforms.uHaze!.value as THREE.Color).lerp(targets.haze, blend);
    (uniforms.uSun!.value as THREE.Color).lerp(targets.sun, blend);

    fog.color.copy(uniforms.uHaze!.value as THREE.Color);
    fog.near += (settings.fogNear - fog.near) * blend;
    fog.far += (settings.fogFar - fog.far) * blend;
    if (scene.fog !== fog) scene.fog = fog;

    sunRef.current?.color.lerp(targets.sun, blend);
    skyRef.current?.position.copy(camera.position);
    cloudMaterial.opacity += (settings.clouds - cloudMaterial.opacity) * blend;

    if (reducedMotion) return;

    const cloudGroup = cloudGroupRef.current;
    if (cloudGroup) {
      cloudGroup.children.forEach((sprite, index) => {
        sprite.position.x += (clouds[index]?.speed ?? 0) * delta;
        if (sprite.position.x > CLOUD_RANGE_X) sprite.position.x = -CLOUD_RANGE_X;
      });
    }
    const particles = particlesRef.current;
    if (particles) {
      particles.position.y = Math.sin(clock.elapsedTime * 0.25) * 0.08;
      particles.position.x = Math.sin(clock.elapsedTime * 0.11) * 0.15;
    }
  });

  return (
    <>
      <mesh ref={skyRef} material={skyMaterial} renderOrder={-10} frustumCulled={false}>
        <sphereGeometry args={[60, 32, 16]} />
      </mesh>

      <hemisphereLight args={['#cfe3ea', '#4a5a48', 1.5]} />
      <directionalLight
        ref={sunRef}
        position={SUN_DIRECTION.clone().multiplyScalar(30)}
        intensity={2.6}
        color={ATMOSPHERES.north.sun}
      />

      <group ref={cloudGroupRef}>
        {clouds.map((cloud, index) => (
          <sprite key={index} position={cloud.position} scale={cloud.scale} material={cloudMaterial} />
        ))}
      </group>

      {quality.particleCount > 0 && (
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={getGlowTexture()}
          color="#ffe0b0"
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      )}
    </>
  );
}
