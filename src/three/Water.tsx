import { useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { SCENE } from '../config/constants';

const VERTEX_SHADER = /* glsl */ `
  #include <common>
  #include <fog_pars_vertex>
  varying vec3 vWorld;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vec4 mvPosition = viewMatrix * world;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  #include <common>
  #include <fog_pars_fragment>
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uSunColor;
  uniform vec3 uSunDirection;
  varying vec3 vWorld;

  void main() {
    // Cheap analytic ripples: no textures, no extra geometry.
    vec3 normal = normalize(vec3(
      0.05 * sin(vWorld.x * 5.0 + uTime * 0.9) + 0.035 * sin(vWorld.z * 9.0 - uTime * 1.2),
      1.0,
      0.05 * cos(vWorld.z * 6.0 + uTime * 0.7) + 0.03 * sin((vWorld.x + vWorld.z) * 11.0 + uTime)
    ));
    vec3 viewDirection = normalize(cameraPosition - vWorld);
    float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 3.0);
    vec3 halfVector = normalize(uSunDirection + viewDirection);
    float glint = pow(max(dot(normal, halfVector), 0.0), 120.0);

    vec3 color = mix(uDeep, uShallow, 0.18 + fresnel * 0.55);
    color += uSunColor * glint * 0.7;

    gl_FragColor = vec4(color, 0.8 + fresnel * 0.2);
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

interface WaterProps {
  animated: boolean;
}

export function Water({ animated }: WaterProps) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        fog: true,
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.fog,
          {
            uTime: { value: 0 },
            uDeep: { value: new THREE.Color(SCENE.waterDeep) },
            uShallow: { value: new THREE.Color(SCENE.waterShallow) },
            uSunColor: { value: new THREE.Color('#ffe2b8') },
            uSunDirection: { value: new THREE.Vector3(...SCENE.sunDirection).normalize() },
          },
        ]),
      }),
    [],
  );

  useFrame((_, delta) => {
    if (animated) material.uniforms.uTime!.value += delta;
  });

  return (
    <mesh rotation-x={-Math.PI / 2} material={material}>
      <planeGeometry args={[400, 400]} />
    </mesh>
  );
}
