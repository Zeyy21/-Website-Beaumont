"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ButtonLink } from "@/components/ui";

const fragmentShader = `
  uniform sampler2D uHouse;
  uniform sampler2D uLogo;
  uniform float uHouseAspect;
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
  }

  vec2 coverUv(vec2 uv, float screenAspect, float imageAspect) {
    if (screenAspect > imageAspect) {
      uv.y = (uv.y - 0.5) * imageAspect / screenAspect + 0.5;
    } else {
      uv.x = (uv.x - 0.5) * screenAspect / imageAspect + 0.5;
    }
    return uv;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 centered = uv - 0.5;
    vec2 metric = centered * vec2(aspect, 1.0);
    float distanceFromCenter = length(metric);
    float p = smoothstep(0.02, 0.98, uProgress);

    // A restrained, living soil surface behind the dimensional monogram.
    float grain = noise(uv * 150.0 + uTime * 0.08);
    float slowCloud = noise(uv * 4.0 + vec2(uTime * 0.025, -uTime * 0.018));
    vec3 soil = mix(vec3(0.075, 0.055, 0.035), vec3(0.25, 0.145, 0.09), slowCloud * 0.44);
    soil += (grain - 0.5) * 0.025;
    soil += vec3(0.20, 0.12, 0.06) * max(0.0, 0.6 - distanceFromCenter) * 0.20;

    // The monogram is built from offset layers, creating a soft 3D extrusion.
    // Portrait screens need a little more breathing room around the mark so it
    // remains a brand object rather than competing with the headline.
    // Desktop uses aspect-correct coordinates so the square monogram remains
    // square on wide screens. Keep the established portrait/mobile mapping.
    vec2 logoUv = aspect > 1.0
      ? vec2((uv.x - 0.5) * 0.76 * aspect, (uv.y - 0.5) * 0.76) + 0.5
      : (uv - 0.5) * 0.94 + 0.5;
    float liquidPeak = sin(p * 3.14159265);
    float waveA = sin(metric.y * 31.0 - uTime * 1.25 + p * 9.0);
    float waveB = sin(metric.x * 24.0 + uTime * 0.85 - p * 7.0);
    vec2 logoWarp = vec2(waveA, waveB) * 0.006 * liquidPeak;
    float logo = texture2D(uLogo, logoUv + logoWarp).a;
    float logoRight = texture2D(uLogo, logoUv + logoWarp + vec2(0.006, 0.0)).a;
    float logoUp = texture2D(uLogo, logoUv + logoWarp + vec2(0.0, 0.006)).a;
    float extrusion = 0.0;
    for (int i = 1; i < 12; i++) {
      float fi = float(i);
      extrusion = max(extrusion, texture2D(uLogo, logoUv + vec2(-0.0026, 0.0032) * fi).a);
    }
    float bevel = clamp(logo - min(logoRight, logoUp), 0.0, 1.0);
    float sheen = 0.64 + 0.34 * sin(uTime * 0.55 + uv.x * 8.0 - uv.y * 5.0);
    vec3 logoColor = mix(vec3(0.66, 0.45, 0.27), vec3(0.99, 0.985, 0.91), sheen);
    vec3 branded = mix(soil, vec3(0.055, 0.033, 0.021), extrusion * (1.0 - logo));
    branded = mix(branded, logoColor + bevel * vec3(0.24, 0.14, 0.06), logo);

    // Water gathers around the mark and bends both surfaces before opening.
    float ripple1 = sin(distanceFromCenter * 72.0 - uTime * 2.3 - p * 13.0);
    float ripple2 = sin(distanceFromCenter * 41.0 + uTime * 1.4 - p * 8.0);
    vec2 direction = metric / max(distanceFromCenter, 0.001);
    vec2 waterOffset = direction * (ripple1 * 0.006 + ripple2 * 0.003) * liquidPeak;
    waterOffset.x /= max(aspect, 0.001);

    vec2 houseUv = coverUv(uv + waterOffset, aspect, uHouseAspect);
    houseUv = (houseUv - 0.5) * mix(1.08, 0.96, p) + 0.5;
    vec3 house = texture2D(uHouse, houseUv).rgb;
    house = mix(house, house * vec3(1.05, 0.93, 0.79), 0.24);
    house *= 0.86 + uv.y * 0.18;

    float edgeNoise = (noise(metric * 9.0 + uTime * 0.12) - 0.5) * 0.08 * liquidPeak;
    float revealRadius = mix(-0.12, 1.32, p);
    float reveal = 1.0 - smoothstep(revealRadius - 0.075, revealRadius + 0.075, distanceFromCenter + edgeNoise);
    float waterLine = 1.0 - smoothstep(0.012, 0.055, abs(distanceFromCenter + edgeNoise - revealRadius));
    vec3 color = mix(branded, house, reveal);
    color += vec3(0.72, 0.79, 0.68) * waterLine * liquidPeak * 0.16;

    // Cinematic top and bottom falloff keeps copy legible over the final image.
    color *= 1.0 - 0.20 * smoothstep(0.58, 1.0, abs(uv.y - 0.5) * 2.0) * p;
    float vignette = 1.0 - smoothstep(0.42, 1.0, length(metric) * 0.72);
    color *= 0.82 + vignette * 0.18;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

function Scene({
  progress,
  reducedMotion,
}: {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const [house, logo] = useTexture([
    "/images/pressure-washed-driveway-placeholder.png",
    "/brand/monogram-ivory-desktop.png",
  ]);

  useEffect(() => {
    house.colorSpace = THREE.SRGBColorSpace;
    logo.colorSpace = THREE.SRGBColorSpace;
  }, [house, logo]);

  const uniforms = useMemo(
    () => ({
      uHouse: { value: house },
      uLogo: { value: logo },
      uHouseAspect: { value: 1.5 },
      uProgress: { value: reducedMotion ? 1 : 0 },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [house, logo, reducedMotion],
  );

  useFrame((state) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    material.current.uniforms.uProgress.value = reducedMotion ? 1 : progress.get();
    material.current.uniforms.uResolution.value.set(
      state.size.width * state.viewport.dpr,
      state.size.height * state.viewport.dpr,
    );
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        toneMapped={false}
      />
    </mesh>
  );
}

export function WebglHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const introOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.16, 0.3, 0.38],
    [0, 0, 1, 1, 0],
  );
  const introY = useTransform(scrollYProgress, [0.1, 0.18, 0.38], [28, 0, -48]);
  const revealOpacity = useTransform(scrollYProgress, [0.76, 0.88], [0, 1]);
  const revealY = useTransform(scrollYProgress, [0.76, 0.9], [45, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08, 0.15], [1, 1, 0]);

  return (
    <section
      ref={ref}
      className="relative -mt-[72px] h-[300svh] bg-soil text-ivory motion-reduce:h-[100svh]"
      aria-label="The Beaumont experience"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-soil">
        <div className="absolute inset-0">
          <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
            camera={{ position: [0, 0, 1] }}
          >
            <Scene progress={scrollYProgress} reducedMotion={Boolean(reduce)} />
          </Canvas>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,10,6,.68)_0%,rgba(15,10,6,.12)_34%,rgba(15,10,6,.14)_56%,rgba(15,10,6,.78)_100%)]" />

        {!reduce && (
          <motion.div
            style={{ opacity: introOpacity, y: introY }}
            className="absolute inset-0 z-10 flex items-center justify-center px-6 pt-20 text-center"
          >
            <div className="max-w-4xl">
              <p className="mb-7 text-[11px] font-semibold uppercase tracking-[0.38em] text-sand">
                Luxury home care · Quietly delivered
              </p>
              <h1 className="text-balance font-display text-[clamp(3.2rem,8vw,7.4rem)] font-normal leading-[0.88] tracking-[-0.02em] text-ivory">
                Come home to
                <span className="mt-2 block italic text-sand">nothing left to do.</span>
              </h1>
              <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-ivory/60 md:text-lg">
                Not simply a cleaner driveway. A brighter arrival, restored curb appeal, and one less thing asking for your time.
              </p>
            </div>
          </motion.div>
        )}

        {!reduce && (
          <motion.div
            style={{ opacity: cueOpacity }}
            className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-center"
          >
            <div className="mx-auto h-12 w-px overflow-hidden bg-ivory/20">
              <motion.span
                className="block h-5 w-px bg-sand"
                animate={{ y: [-20, 48] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}

        <motion.div
          style={reduce ? undefined : { opacity: revealOpacity, y: revealY }}
          className="absolute inset-x-0 bottom-0 z-10 px-6 pb-10 pt-28 md:px-8 md:pb-16"
        >
          <div className="mx-auto flex max-w-shell flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-sand">
                This is what clean feels like
              </p>
              <h2 className="mt-4 text-balance font-display text-[clamp(2.8rem,6vw,5.9rem)] leading-[0.9] text-ivory">
                Your home,
                <span className="block italic text-sand">returned to you.</span>
              </h2>
            </div>
            <div className="pointer-events-auto flex flex-wrap gap-3">
              <ButtonLink href="/quote" variant="light" size="lg">
                Begin your reset
                <Arrow />
              </ButtonLink>
              <ButtonLink
                href="/about"
                size="lg"
                className="border border-ivory/25 bg-soil/20 text-ivory backdrop-blur-md hover:bg-ivory hover:text-soil"
              >
                Our philosophy
              </ButtonLink>
            </div>
          </div>
        </motion.div>

        <div className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
          <div className="h-24 w-px bg-ivory/15">
            <motion.div
              className="w-px origin-top bg-sand"
              style={{ height: "100%", scaleY: reduce ? 1 : scrollYProgress }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
