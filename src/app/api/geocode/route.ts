import { NextRequest, NextResponse } from "next/server";
import { site } from "@/lib/config";

export const runtime = "nodejs";

interface Suggestion {
  label: string;
  lat: number;
  lon: number;
}

const requestHeaders = {
  "User-Agent": `BeaumontPressureWashing/1.0 (${site.url})`,
  "Accept-Language": "en-CA,en;q=0.9",
  Accept: "application/json",
};

export async function GET(request: NextRequest) {
  const q = normalizeCanadianQuery(request.nextUrl.searchParams.get("q")?.trim() ?? "");
  const latParam = request.nextUrl.searchParams.get("lat");
  const lonParam = request.nextUrl.searchParams.get("lon");
  const lat = latParam === null ? Number.NaN : Number(latParam);
  const lon = lonParam === null ? Number.NaN : Number(lonParam);

  if (latParam !== null && lonParam !== null && Number.isFinite(lat) && Number.isFinite(lon)) {
    return reverseGeocode(lat, lon);
  }
  if (q.length < 3) return NextResponse.json({ results: [] as Suggestion[] });

  const biasLat = request.nextUrl.searchParams.get("biasLat");
  const biasLon = request.nextUrl.searchParams.get("biasLon");
  const bias = biasLat && biasLon ? `&lat=${encodeURIComponent(biasLat)}&lon=${encodeURIComponent(biasLon)}` : "";

  const [canadianAddress, photonResults] = await Promise.all([
    looksLikeStreetAddress(q) ? geocodeCanadianAddress(q) : Promise.resolve(null),
    searchPhoton(q, bias),
  ]);
  const primaryResults = dedupe([
    ...(canadianAddress ? [canadianAddress] : []),
    ...photonResults.filter(
      (result) => !canadianAddress || !sameLocation(canadianAddress, result),
    ),
  ]);
  if (primaryResults.length) {
    return NextResponse.json({
      results: primaryResults,
      source: canadianAddress ? "geocoder.ca+photon" : "photon",
    });
  }

  try {
    const nominatim = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=ca&limit=8&q=${encodeURIComponent(q)}`,
      { headers: requestHeaders, signal: AbortSignal.timeout(7000), cache: "no-store" },
    );
    if (nominatim.ok) {
      const data = (await nominatim.json()) as NominatimItem[];
      return NextResponse.json({
        results: data.map((item) => ({
          label: item.display_name,
          lat: Number(item.lat),
          lon: Number(item.lon),
        })),
        source: "nominatim",
      });
    }
  } catch {
    // The client receives a useful failure state below.
  }

  return NextResponse.json(
    { results: [] as Suggestion[], error: "Address search is temporarily unavailable. Please try again." },
    { status: 502 },
  );
}

async function geocodeCanadianAddress(query: string): Promise<Suggestion | null> {
  const params = new URLSearchParams({
    locate: localizeGreaterMontrealAddress(query),
    geoit: "XML",
    standard: "1",
    showpostal: "1",
  });
  const key = process.env.GEOCODER_KEY?.trim();
  if (key) params.set("auth", key);

  try {
    const response = await fetch(`https://geocoder.ca/?${params.toString()}`, {
      headers: requestHeaders,
      signal: AbortSignal.timeout(7000),
      cache: "no-store",
    });
    if (!response.ok) return null;

    const xml = await response.text();
    const lat = Number(xmlValue(xml, "latt"));
    const lon = Number(xmlValue(xml, "longt"));
    const confidence = Number(xmlValue(xml, "confidence"));
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || confidence < 0.8) return null;

    const street = [xmlValue(xml, "stnumber"), xmlValue(xml, "staddress")]
      .filter(Boolean)
      .join(" ");
    const postal = formatPostalCode(xmlValue(xml, "postal"));
    const label = [
      street,
      xmlValue(xml, "city"),
      xmlValue(xml, "prov"),
      postal,
      "Canada",
    ]
      .filter(Boolean)
      .join(", ");

    return label ? { label, lat, lon } : null;
  } catch {
    return null;
  }
}

async function searchPhoton(query: string, bias: string): Promise<Suggestion[]> {
  try {
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(`${query}, Canada`)}&limit=8&lang=en${bias}`,
      { headers: requestHeaders, signal: AbortSignal.timeout(7000), cache: "no-store" },
    );
    if (!response.ok) return [];
    const data = (await response.json()) as PhotonResponse;
    return (data.features ?? [])
      .map(featureToSuggestion)
      .filter((result): result is Suggestion => result !== null);
  } catch {
    return [];
  }
}

async function reverseGeocode(lat: number, lon: number) {
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json({ error: "Invalid coordinates." }, { status: 400 });
  }
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&addressdetails=1&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`,
      { headers: requestHeaders, signal: AbortSignal.timeout(7000), cache: "no-store" },
    );
    if (response.ok) {
      const data = (await response.json()) as NominatimItem;
      return NextResponse.json({
        result: { label: data.display_name || "Your approximate location", lat, lon },
        source: "nominatim",
      });
    }
  } catch {
    // Return coordinates so the map can still move even if reverse lookup fails.
  }
  return NextResponse.json({ result: { label: "Your approximate location", lat, lon } });
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

function featureToSuggestion(feature: NonNullable<PhotonResponse["features"]>[number]): Suggestion | null {
  const coordinates = feature.geometry?.coordinates;
  if (!coordinates || !Number.isFinite(coordinates[0]) || !Number.isFinite(coordinates[1])) return null;
  const properties = feature.properties ?? {};
  const countryCode = (properties.countrycode ?? "").toLowerCase();
  if (countryCode && countryCode !== "ca") return null;
  const label = [
    [properties.housenumber, properties.street].filter(Boolean).join(" "),
    properties.city ?? properties.district ?? properties.name,
    properties.state,
    properties.postcode,
    properties.country,
  ]
    .filter(Boolean)
    .join(", ");
  return { label: label || properties.name || "Selected location", lat: coordinates[1], lon: coordinates[0] };
}

function normalizeCanadianQuery(value: string) {
  const compactPostal = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z]\d$/.test(compactPostal)) {
    return `${compactPostal.slice(0, 3)} ${compactPostal.slice(3)}`;
  }
  return value.replace(/\s+/g, " ").trim();
}

function looksLikeStreetAddress(value: string) {
  return /^\d+[a-z]?(?:-\d+[a-z]?)?\s+\S+\s+\S+/i.test(value.trim());
}

function localizeGreaterMontrealAddress(value: string) {
  const hasMunicipality = /\b(?:montr[eé]al|verdun|laval|longueuil|brossard|westmount|lasalle|lachine|dorval|pointe-claire|kirkland|beaconsfield|saint-lambert|saint-laurent|outremont|anjou|qc|qu[eé]bec)\b/i.test(
    value,
  );
  return hasMunicipality ? `${value}, QC, Canada` : `${value}, Montreal, QC, Canada`;
}

function xmlValue(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\/${tag}>`, "i"));
  return decodeXml(match?.[1]?.trim() ?? "");
}

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function formatPostalCode(value: string) {
  const compact = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return compact.length === 6 ? `${compact.slice(0, 3)} ${compact.slice(3)}` : value;
}

function sameLocation(a: Suggestion, b: Suggestion) {
  return Math.abs(a.lat - b.lat) < 0.00015 && Math.abs(a.lon - b.lon) < 0.0002;
}

function dedupe(results: Suggestion[]) {
  const seen = new Set<string>();
  return results.filter((result) => {
    const key = result.label.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
