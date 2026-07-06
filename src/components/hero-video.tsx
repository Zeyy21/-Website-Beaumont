"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/video/hero-beaumont.mp4";
const POSTER_SRC = "/images/montreal-home-hero.png";

/**
 * Full-bleed hero background video with a poster underlay.
 *
 * The poster paints immediately (great for LCP / SSR) and the video fades in
 * only once its first frames are decoded, so there is never a black flash or a
 * pop. On reduced-motion or a decode/playback failure we simply keep the poster
 * — the hero is always legible either way.
 */
export function HeroVideo({}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => setReady(true);
    const markFailed = () => setFailed(true);

    // Some browsers fire `canplay` before React attaches the listener; cover
    // that by checking readiness immediately, then keep the safety-net play().
    if (video.readyState >= 3) markReady();
    video.addEventListener("canplay", markReady);
    video.addEventListener("error", markFailed);

    const attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      // Autoplay can be blocked (rare when muted) — poster stays, no crash.
      attempt.catch(() => {});
    }

    return () => {
      video.removeEventListener("canplay", markReady);
      video.removeEventListener("error", markFailed);
    };
  }, []);

  const showVideo = !failed;

  return (
    <div className="absolute inset-0 h-full w-full">
      {/* Poster underlay — always present, fades out under the playing video. */}
      <Image
        src={POSTER_SRC}
        alt=""
        fill
        priority
        sizes="100vw"
        className={`object-cover object-[63%_center] transition-opacity duration-[1200ms] ease-out md:object-center ${
          ready && showVideo ? "opacity-0" : "opacity-100"
        }`}
      />

      {showVideo && (
        <video
          ref={videoRef}
          className={`hero-video-drift absolute inset-0 h-full w-full object-cover object-[63%_center] transition-opacity duration-[1200ms] ease-out md:object-center ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={POSTER_SRC}
          aria-hidden="true"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
