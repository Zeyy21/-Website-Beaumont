"use client";

import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  uniform float uLayer;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;
    float foreground = 1.0 - smoothstep(0.18, 0.62, uv.y);
    p.z += sin((p.x * 0.72) + (uTime * 0.18)) * 0.018 * foreground * uLayer;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uLayer;
  uniform vec2 uPointer;
  varying vec2 vUv;

  void main() {
    vec2 depthOffset = uPointer * (0.0015 + uLayer * 0.0035);
    vec2 sampleUv = clamp(vUv + depthOffset, 0.002, 0.998);
    vec4 texel = texture2D(uMap, sampleUv);
    float mask = 1.0;
    float alpha = 1.0;

    if (uLayer > 0.5 && uLayer < 1.5) {
      mask = 1.0 - smoothstep(0.18, 0.57, vUv.y);
      alpha = 0.34;
    } else if (uLayer > 1.5) {
      float edgeDistance = min(vUv.x, 1.0 - vUv.x);
      float edgeMask = 1.0 - smoothstep(0.06, 0.3, edgeDistance);
      mask = edgeMask * smoothstep(0.14, 0.72, vUv.y);
      alpha = 0.22;
    }

    float driveway = 1.0 - smoothstep(0.1, 0.56, vUv.y);
    float sheenLine = 1.0 - smoothstep(0.0, 0.12, abs(vUv.x - fract(uTime * 0.018)));
    vec3 sheen = vec3(0.14, 0.18, 0.16) * sheenLine * driveway * 0.16 * (1.0 - step(0.5, uLayer));
    vec3 color = texel.rgb + sheen;

    gl_FragColor = vec4(color, texel.a * mask * alpha);
  }
`;

export function HeroHouse3D() {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 10], fov: 45, near: 0.1, far: 30 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#1c1c1a"]} />
        <Suspense fallback={null}>
          <HouseScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

function HouseScene() {
  const group = useRef<THREE.Group>(null);
  const foreground = useRef<THREE.Mesh>(null);
  const edges = useRef<THREE.Mesh>(null);
  const materials = useRef<THREE.ShaderMaterial[]>([]);
  const texture = useLoader(THREE.TextureLoader, "/images/montreal-home-hero.png");
  const { viewport, camera } = useThree();
  const pointer = useRef(new THREE.Vector2());

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  const scale = useMemo(() => {
    const current = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, 0));
    return Math.max(current.width / 16, current.height / 9) * 1.025;
  }, [camera, viewport]);

  useFrame((state, delta) => {
    const damping = 1 - Math.exp(-delta * 2.8);
    pointer.current.lerp(state.pointer, damping);

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.current.x * 0.018, damping);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.current.y * 0.012, damping);
    }
    if (foreground.current) {
      foreground.current.position.x = THREE.MathUtils.lerp(foreground.current.position.x, pointer.current.x * 0.09, damping);
      foreground.current.position.y = THREE.MathUtils.lerp(foreground.current.position.y, pointer.current.y * 0.035, damping);
    }
    if (edges.current) {
      edges.current.position.x = THREE.MathUtils.lerp(edges.current.position.x, pointer.current.x * 0.045, damping);
    }

    materials.current.forEach((material) => {
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uPointer.value.copy(pointer.current);
    });
  });

  return (
    <group ref={group} scale={[scale, scale, 1]}>
      <Plane texture={texture} layer={0} z={0} materials={materials} />
      <Plane meshRef={foreground} texture={texture} layer={1} z={0.12} materials={materials} />
      <Plane meshRef={edges} texture={texture} layer={2} z={0.075} materials={materials} />
    </group>
  );
}

type PlaneProps = {
  texture: THREE.Texture;
  layer: number;
  z: number;
  materials: MutableRefObject<THREE.ShaderMaterial[]>;
  meshRef?: MutableRefObject<THREE.Mesh | null>;
};

function Plane({ texture, layer, z, materials, meshRef }: PlaneProps) {
  const material = useMemo(
    () => new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: texture },
        uTime: { value: 0 },
        uLayer: { value: layer },
        uPointer: { value: new THREE.Vector2() },
      },
      vertexShader,
      fragmentShader,
      transparent: layer > 0,
      depthWrite: layer === 0,
      toneMapped: false,
    }),
    [layer, texture],
  );

  useEffect(() => {
    materials.current.push(material);
    return () => {
      materials.current = materials.current.filter((item) => item !== material);
      material.dispose();
    };
  }, [material, materials]);

  return (
    <mesh ref={meshRef} position={[0, 0, z]}>
      <planeGeometry args={[16, 9, 64, 36]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
