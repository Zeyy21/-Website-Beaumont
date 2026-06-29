"use client";

import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/cn";
import { useT } from "@/components/i18n/locale-provider";

/**
 * Draggable before/after image comparison. Works with mouse, touch, and
 * keyboard (arrow keys on the handle). Uses gradient placeholders when no
 * image URLs are supplied so it renders with zero assets.
 */
export function BeforeAfter({
  beforeUrl,
  afterUrl,
  beforeLabel,
  afterLabel,
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
  const { dict } = useT();
  const beforeText = beforeLabel ?? dict.admin.gallery.before;
  const afterText = afterLabel ?? dict.admin.gallery.after;
  const [pos, setPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
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
        className="relative aspect-[4/3] w-full touch-none select-none overflow-hidden rounded-2xl shadow-soft cursor-ew-resize"
        onPointerDown={(e) => {
          dragging.current = true;
          setIsDragging(true);
          e.currentTarget.setPointerCapture(e.pointerId);
          update(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && update(e.clientX)}
        onPointerUp={() => {
          dragging.current = false;
          setIsDragging(false);
        }}
        onPointerCancel={() => {
          dragging.current = false;
          setIsDragging(false);
        }}
      >
        {/* AFTER (full background) */}
        <div className="absolute inset-0">
          {afterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={afterUrl} alt={afterText} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sand to-ochre">
              <span className="font-display text-2xl text-oak/40">{afterText}</span>
            </div>
          )}
          <span className="absolute bottom-3 right-3 rounded-full bg-soil/70 px-3 py-1 text-xs font-medium text-ivory">
            {afterText}
          </span>
        </div>

        {/* BEFORE (clipped to the slider position) */}
        <div
          className={cn(
            "absolute inset-0 overflow-hidden will-change-[clip-path]",
            !isDragging && "transition-[clip-path] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          )}
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          {beforeUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={beforeUrl}
              alt={beforeText}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-oak to-soil">
              <span className="font-display text-2xl text-ivory/40">{beforeText}</span>
            </div>
          )}
          <span className="absolute bottom-3 left-3 rounded-full bg-ivory/85 px-3 py-1 text-xs font-medium text-oak">
            {beforeText}
          </span>
        </div>

        {/* Handle */}
        <div
          className={cn(
            "absolute inset-y-0 z-10 w-0.5 bg-ivory will-change-[left]",
            !isDragging && "transition-[left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          )}
          style={{ left: `${pos}%` }}
        >
          <button
            className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-ivory text-oak shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre"
            role="slider"
            aria-label={dict.admin.gallery.dragToCompare}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
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
