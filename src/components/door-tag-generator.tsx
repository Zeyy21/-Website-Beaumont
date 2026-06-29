"use client";

import { useState } from "react";
import Image from "next/image";
import { site } from "@/lib/config";
import { Button } from "@/components/ui";
import { useT } from "@/components/i18n/locale-provider";

interface Tag {
  zone: string;
  tagId: string;
  url: string;
  qrDataUrl: string;
}

/**
 * Generates per-zone door-tag QR codes via /api/door-tag and renders
 * print-ready hangers. "Print" opens the browser print dialog; the print CSS
 * (see globals via .print-* utility classes inline) lays them out for cutting.
 */
export function DoorTagGenerator() {
  const { dict } = useT();
  const t = dict.admin.doorTags;
  const [zonesText, setZonesText] = useState("Maple Ridge\nKing's Park");
  const [perZone, setPerZone] = useState(4);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const zones = zonesText
      .split("\n")
      .map((z) => z.trim())
      .filter(Boolean);
    try {
      const res = await fetch("/api/door-tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zones, perZone }),
      });
      const data = (await res.json()) as { tags: Tag[] };
      setTags(data.tags ?? []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* controls (hidden when printing) */}
      <div className="no-print rounded-2xl border border-oak/10 bg-white p-6 shadow-soft">
        <h3 className="text-lg text-oak">{t.generateHeading}</h3>
        <p className="mt-1 text-sm text-soil/60">
          {t.generateDescription}
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="mb-1 block text-sm text-soil/60">
              {t.zonesLabel}
            </span>
            <textarea
              value={zonesText}
              onChange={(e) => setZonesText(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-oak/20 bg-white px-3 py-2 text-soil outline-none focus:border-ochre"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-soil/60">{t.perZone}</span>
            <input
              type="number"
              min={1}
              max={100}
              value={perZone}
              onChange={(e) => setPerZone(Number(e.target.value))}
              className="w-24 rounded-xl border border-oak/20 bg-white px-3 py-2 text-soil outline-none focus:border-ochre"
            />
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <Button onClick={generate} disabled={loading}>
            {loading ? t.generating : t.generate}
          </Button>
          {tags.length > 0 && (
            <Button variant="outline" onClick={() => window.print()}>
              {t.printTags} {tags.length} {t.tags}
            </Button>
          )}
        </div>
      </div>

      {/* hangers */}
      {tags.length > 0 && (
        <div className="print-area mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag) => (
            <Hanger key={tag.tagId} tag={tag} />
          ))}
        </div>
      )}

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: #fff !important;
          }
          .print-area {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .hanger {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

/** A single premium die-cut door hanger (front face shown; QR + URL below). */
function Hanger({ tag }: { tag: Tag }) {
  const { dict } = useT();
  const t = dict.admin.doorTags;
  return (
    <div className="hanger overflow-hidden rounded-[20px] border border-oak/15 bg-white shadow-soft">
      {/* die-cut top notch hint */}
      <div className="texture-soil relative px-6 pb-6 pt-5 text-center text-ivory">
        <div className="mx-auto mb-3 h-6 w-6 rounded-full border-2 border-ivory/40" />
        <Image
          src="/brand/wordmark-ivory.png"
          alt="Beaumont"
          width={180}
          height={42}
          className="mx-auto h-7 w-auto object-contain"
        />
        <p className="mt-3 font-display text-lg text-sand">{dict.site.promise}</p>
        <p className="mt-1 text-xs text-ivory/60">{dict.site.tagline}</p>
      </div>

      <div className="p-5 text-center">
        <div className="mx-auto w-fit rounded-xl bg-ivory p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tag.qrDataUrl} alt={`QR — ${tag.zone}`} className="h-32 w-32" />
        </div>
        <p className="mt-3 font-display text-base text-oak">
          {t.scanFree} <em>{t.thisHome}</em> {t.home}
        </p>
        <p className="mt-1 text-xs text-soil/50">{site.url.replace(/^https?:\/\//, "")}/quote</p>
        <p className="mt-2 text-[10px] uppercase tracking-widest text-ochre">
          {tag.zone} · {tag.tagId}
        </p>
      </div>
    </div>
  );
}
