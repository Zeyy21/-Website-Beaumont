"use client";

import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/cn";

/**
 * Draggable before/after image comparison. Works with mouse, touch, and
 * keyboard (arrow keys on the handle). Uses gradient placeholders when no
 * image URLs are supplied so it renders with zero assets.
 */
export function BeforeAfter({
  beforeUrl,
  afterUrl,
  beforeLabel = "Before",
  afterLabel = "After",
  caption,
  className,
}: {
  beforeUrl?: string;
  afterUrl?: string;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <figure className={cn("group", className)}>
      <div
        ref={ref}
        className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl shadow-soft"
        onMouseDown={(e) => {
          dragging.current = true;
          update(e.clientX);
        }}
        onMouseMove={(e) => dragging.current && update(e.clientX)}
        onMouseUp={() => (dragging.current = false)}
        onMouseLeave={() => (dragging.current = false)}
        onTouchStart={(e) => update(e.touches[0].clientX)}
        onTouchMove={(e) => update(e.touches[0].clientX)}
      >
        {/* AFTER (full background) */}
        <div className="absolute inset-0">
          {afterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={afterUrl} alt={afterLabel} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sand to-ochre">
              <span className="font-display text-2xl text-oak/40">After</span>
            </div>
          )}
          <span className="absolute bottom-3 right-3 rounded-full bg-soil/70 px-3 py-1 text-xs font-medium text-ivory">
            {afterLabel}
          </span>
        </div>

        {/* BEFORE (clipped to the slider position) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${pos}%` }}
        >
          {beforeUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={beforeUrl}
              alt={beforeLabel}
              className="h-full w-full object-cover"
              style={{ width: ref.current?.clientWidth ?? "100%" }}
            />
          ) : (
            <div
              className="flex h-full items-center justify-center bg-gradient-to-br from-oak to-soil"
              style={{ width: ref.current?.clientWidth ?? "100%" }}
            >
              <span className="font-display text-2xl text-ivory/40">Before</span>
            </div>
          )}
          <span className="absolute bottom-3 left-3 rounded-full bg-ivory/85 px-3 py-1 text-xs font-medium text-oak">
            {beforeLabel}
          </span>
        </div>

        {/* Handle */}
        <div
          className="absolute inset-y-0 z-10 w-0.5 bg-ivory"
          style={{ left: `${pos}%` }}
        >
          <button
            className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-ivory text-oak shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre"
            aria-label="Drag to compare before and after"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
              if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
            }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 7l-4 5 4 5M16 7l4 5-4 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-soil/60">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
