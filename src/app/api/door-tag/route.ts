import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { site } from "@/lib/config";

/**
 * Generates per-zone door-tag QR codes. Each QR encodes a deep link into the
 * quote request tool pre-seeded with the zone + a unique tag id, so scans are
 * attributable (logged into door_tag_scans) and the quote is pre-tuned.
 *
 * POST { zones: string[], perZone?: number }  →  { tags: [...] }
 * GET  ?zone=Maple%20Ridge&n=10              →  same, querystring form
 */

interface Tag {
  zone: string;
  tagId: string;
  url: string;
  qrDataUrl: string;
}

async function buildTags(zone: string, count: number): Promise<Tag[]> {
  const tags: Tag[] = [];
  for (let i = 0; i < count; i++) {
    const tagId = `${slug(zone)}-${rand()}`;
    const url = `${site.url}/quote?zone=${encodeURIComponent(zone)}&tag=${tagId}`;
    const qrDataUrl = await QRCode.toDataURL(url, {
      margin: 1,
      width: 512,
      color: { dark: "#1D170F", light: "#F9F8E7" },
    });
    tags.push({ zone, tagId, url, qrDataUrl });
  }
  return tags;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    zones?: string[];
    perZone?: number;
  };
  const zones = body.zones?.length ? body.zones : ["General"];
  const perZone = clamp(body.perZone ?? 1, 1, 100);

  const tags: Tag[] = [];
  for (const zone of zones) tags.push(...(await buildTags(zone, perZone)));
  return NextResponse.json({ tags });
}

export async function GET(req: NextRequest) {
  const zone = req.nextUrl.searchParams.get("zone") ?? "General";
  const n = clamp(Number(req.nextUrl.searchParams.get("n") ?? 1), 1, 100);
  const tags = await buildTags(zone, n);
  return NextResponse.json({ tags });
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "zone";
const rand = () => Math.random().toString(36).slice(2, 7);
const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, Number.isFinite(n) ? n : lo));
