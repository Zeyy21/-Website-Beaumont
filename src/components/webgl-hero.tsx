"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useScroll } from "framer-motion";

// GLSL Fragment Shader for the liquid distortion and crossfade
const fragmentShader = `
  uniform sampler2D uTexFrom;
  uniform sampler2D uTexTo;
  uniform float uProgress;
  uniform float uTime;
  varying vec2 vUv;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    
    // Constant gentle wave motion
    float noiseVal = snoise(uv * 5.0 + uTime * 0.4);
    
    // As progress approaches 0.5, distortion reaches its maximum (like splashing water)
    float distortion = sin(uProgress * 3.14159) * 0.15;
    
    vec2 warpedUv = uv + vec2(noiseVal) * distortion;
    
    // Zoom effect on the house background as we scroll
    vec2 toUv = (warpedUv - 0.5) * (1.0 - uProgress * 0.1) + 0.5;
    
    vec4 colorFrom = texture2D(uTexFrom, warpedUv);
    vec4 colorTo = texture2D(uTexTo, toUv);
    
    // Smooth crossfade centered around 0.5 progress
    float alpha = smoothstep(0.2, 0.8, uProgress);
    
    gl_FragColor = mix(colorFrom, colorTo, alpha);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function Scene() {
  const { scrollY } = useScroll();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Load the luxury house texture
  const houseTexture = useTexture("/images/luxury-home.png");
  houseTexture.colorSpace = THREE.SRGBColorSpace;

  // Dynamically create a texture for the logo to perfectly match the viewport
  const [logoTexture, setLogoTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth * 2; // high res
    canvas.height = window.innerHeight * 2;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Background: Beaumont Soil (#1d170f)
      ctx.fillStyle = "#1d170f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Text: Beaumont Ivory (#f9f8e7)
      ctx.fillStyle = "#f9f8e7";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // Fallback serif if Bombay Black isn't loaded on canvas
      ctx.font = `300 ${canvas.width * 0.05}px "Cormorant", serif`;
      ctx.letterSpacing = "10px";
      ctx.fillText("B E A U M O N T", canvas.width / 2, canvas.height / 2);
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    setLogoTexture(tex);
  }, []);

  const uniforms = useMemo(
    () => ({
      uTexFrom: { value: null },
      uTexTo: { value: houseTexture },
      uProgress: { value: 0 },
      uTime: { value: 0 },
    }),
    [houseTexture]
  );

  useEffect(() => {
    if (materialRef.current && logoTexture) {
      materialRef.current.uniforms.uTexFrom.value = logoTexture;
    }
  }, [logoTexture]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Map scroll Y to progress 0->1. Assumes 100vh scroll height for the transition.
      const currentScroll = scrollY.get();
      const windowHeight = window.innerHeight;
      const rawProgress = currentScroll / (windowHeight * 1.5);
      const progress = Math.min(Math.max(rawProgress, 0), 1); // clamp 0-1
      
      materialRef.current.uniforms.uProgress.value = progress;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      {logoTexture && (
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      )}
    </mesh>
  );
}

export function WebglHero() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-soil">
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
