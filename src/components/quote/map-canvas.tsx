"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import area from "@turf/area";
import { polygon as turfPolygon } from "@turf/helpers";

/**
 * Leaflet + OpenStreetMap map with Geoman polygon drawing.
 *
 * IMPORTANT: this is PROP-DRIVEN, not ref-driven. A ref cannot be forwarded
 * through next/dynamic(), which silently broke the previous imperative version
 * (mapRef.current was always null, so "Start Drawing" did nothing). Instead the
 * parent bumps `drawNonce` to begin drawing and `clearNonce` to clear, and the
 * map reacts in effects. Reliable through dynamic import, no ref needed.
 */
export function MapCanvas({
  center,
  drawNonce = 0,
  clearNonce = 0,
  zoomNonce = 0,
  onAreaChange,
  onDrawingChange,
}: {
  center: { lat: number; lon: number } | null;
  /** increment to start drawing a fresh polygon */
  drawNonce?: number;
  /** increment to clear all polygons */
  clearNonce?: number;
  /** encodes a zoom request as {dir:1|-1, n} via the number's sign + magnitude */
  zoomNonce?: number;
  onAreaChange: (m2: number) => void;
  onDrawingChange?: (isDrawing: boolean) => void;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  const clearPolygons = (map: L.Map) => {
    map.eachLayer((layer) => {
      if (layer instanceof L.Polygon) map.removeLayer(layer);
    });
  };

  const recompute = (map: L.Map) => {
    let total = 0;
    map.eachLayer((layer) => {
      const gj = (layer as L.Polygon).toGeoJSON?.();
      if (gj && gj.type === "Feature" && gj.geometry?.type === "Polygon") {
        try {
          total += area(
            turfPolygon((gj.geometry as GeoJSON.Polygon).coordinates),
          );
        } catch {
          /* ignore malformed ring mid-draw */
        }
      }
    });
    onAreaChange(Math.round(total));
  };

  // init once
  useEffect(() => {
    if (!elRef.current || mapRef.current) return;

    const map = L.map(elRef.current, {
      center: [43.6532, -79.3832],
      zoom: 17,
      zoomControl: false,
      attributionControl: false,
    });
    mapRef.current = map;

    // High-detail satellite-style imagery reads as "premium" and lets people
    // actually see their roofline to trace it. Esri World Imagery is free.
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 21,
        attribution: "&copy; Esri",
      },
    ).addTo(map);
    // Street labels overlaid so addresses stay legible on the imagery.
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/light_only_labels/{z}/{x}/{y}{r}.png",
      { maxZoom: 21, opacity: 0.9 },
    ).addTo(map);

    map.pm.setGlobalOptions({ snappable: true, snapDistance: 20 });
    map.pm.setPathOptions({
      color: "#C9A24B", // gold, high contrast on imagery
      fillColor: "#C9A24B",
      fillOpacity: 0.25,
      weight: 3,
    });

    map.on("pm:create", (e: { layer: L.Layer }) => {
      recompute(map);
      e.layer.on("pm:edit", () => recompute(map));
      e.layer.on("pm:markerdragend", () => recompute(map));
      onDrawingChange?.(false);
    });
    map.on("pm:remove", () => recompute(map));
    map.on("pm:drawstart", () => onDrawingChange?.(true));
    map.on("pm:drawend", () => onDrawingChange?.(false));

    const t = setTimeout(() => mapRef.current?.invalidateSize(), 250);
    return () => {
      clearTimeout(t);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fly to searched address
  useEffect(() => {
    if (center && mapRef.current) {
      mapRef.current.flyTo([center.lat, center.lon], 20, { duration: 1.2 });
    }
  }, [center]);

  // start drawing when drawNonce changes (ignore initial 0)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || drawNonce === 0) return;
    map.pm.disableDraw();
    clearPolygons(map);
    onAreaChange(0);
    map.pm.enableDraw("Polygon");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawNonce]);

  // clear when clearNonce changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || clearNonce === 0) return;
    map.pm.disableDraw();
    clearPolygons(map);
    onAreaChange(0);
    onDrawingChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearNonce]);

  // zoom: positive nonce zooms in, negative zooms out (magnitude = trigger)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || zoomNonce === 0) return;
    if (zoomNonce > 0) map.zoomIn();
    else map.zoomOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomNonce]);

  return (
    <div
      ref={elRef}
      className="h-[320px] w-full overflow-hidden rounded-[1.5rem] border border-oak/15 md:h-[400px]"
      role="application"
      aria-label="Map. Draw your property to estimate its area."
    />
  );
}
