import { NextRequest, NextResponse } from "next/server";
import { site } from "@/lib/config";

/**
 * Server-side geocoding proxy. Keeps us compliant with OSM usage policy:
 *  - sends a proper User-Agent identifying the app,
 *  - runs server-side (Nominatim forbids client-side autocomplete),
 *  - caches responses at the edge.
 * Primary: Photon (Komoot, autocomplete-friendly). Fallback: Nominatim.
 * No API key required. A paid GEOCODER can be slotted in here later.
 */

export const runtime = "edge";

interface Suggestion {
  label: string;
  lat: number;
  lon: number;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 3) {
    return NextResponse.json({ results: [] as Suggestion[] });
  }

  const headers = {
    "User-Agent": `BeaumontApp/1.0 (${site.url})`,
    "Accept-Language": "en",
  };

  try {
    const photon = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5`,
      { headers, next: { revalidate: 86400 } },
    );
    if (photon.ok) {
      const data = (await photon.json()) as PhotonResponse;
      const results = (data.features ?? [])
        .map(featureToSuggestion)
        .filter((s): s is Suggestion => s !== null);
      if (results.length) return NextResponse.json({ results });
    }
  } catch {
    // fall through to Nominatim
  }

  try {
    const nominatim = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&q=${encodeURIComponent(
        q,
      )}`,
      { headers, next: { revalidate: 86400 } },
    );
    if (nominatim.ok) {
      const data = (await nominatim.json()) as NominatimItem[];
      const results: Suggestion[] = data.map((d) => ({
        label: d.display_name,
        lat: Number(d.lat),
        lon: Number(d.lon),
      }));
      return NextResponse.json({ results });
    }
  } catch {
    // both failed
  }

  return NextResponse.json({ results: [] as Suggestion[] }, { status: 200 });
}

interface PhotonResponse {
  features?: Array<{
    geometry: { coordinates: [number, number] };
    properties: Record<string, string | undefined>;
  }>;
}
interface NominatimItem {
  display_name: string;
  lat: string;
  lon: string;
}

function featureToSuggestion(
  f: NonNullable<PhotonResponse["features"]>[number],
): Suggestion | null {
  const c = f.geometry?.coordinates;
  if (!c) return null;
  const p = f.properties ?? {};
  const label = [
    [p.housenumber, p.street].filter(Boolean).join(" "),
    p.city ?? p.name,
    p.state,
    p.country,
  ]
    .filter(Boolean)
    .join(", ");
  return { label: label || (p.name ?? "Unknown"), lat: c[1], lon: c[0] };
}
