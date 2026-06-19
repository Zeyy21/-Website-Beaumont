"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import area from "@turf/area";
import { polygon as turfPolygon } from "@turf/helpers";

/**
 * Leaflet + OpenStreetMap map with Geoman polygon drawing. Reports the drawn
 * area (m²) up to the parent. No API key — OSM tiles are free.
 *
 * `center` flies the map when it changes (e.g. after an address search).
 */
export function MapCanvas({
  center,
  onAreaChange,
}: {
  center: { lat: number; lon: number } | null;
  onAreaChange: (m2: number) => void;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // init once
  useEffect(() => {
    if (!elRef.current || mapRef.current) return;

    const map = L.map(elRef.current, {
      center: [40.7128, -74.006],
      zoom: 18,
      zoomControl: true,
      attributionControl: true,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Geoman: only the polygon tool, brand-styled.
    map.pm.addControls({
      position: "topright",
      drawCircle: false,
      drawCircleMarker: false,
      drawMarker: false,
      drawPolyline: false,
      drawText: false,
      drawRectangle: true,
      cutPolygon: false,
      rotateMode: false,
    });
    map.pm.setPathOptions({
      color: "#7A4327",
      fillColor: "#A1794F",
      fillOpacity: 0.3,
      weight: 3,
    });

    const recompute = () => {
      let total = 0;
      map.eachLayer((layer) => {
        const gj = (layer as L.Polygon).toGeoJSON?.();
        if (
          gj &&
          gj.type === "Feature" &&
          gj.geometry?.type === "Polygon"
        ) {
          try {
            total += area(
              turfPolygon(
                (gj.geometry as GeoJSON.Polygon).coordinates,
              ),
            );
          } catch {
            /* ignore malformed ring */
          }
        }
      });
      onAreaChange(Math.round(total));
    };

    map.on("pm:create", (e: { layer: L.Layer }) => {
      recompute();
      e.layer.on("pm:edit", recompute);
      e.layer.on("pm:dragend", recompute);
    });
    map.on("pm:remove", recompute);

    // Leaflet needs a size kick when revealed inside animated containers.
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fly to searched address
  useEffect(() => {
    if (center && mapRef.current) {
      mapRef.current.flyTo([center.lat, center.lon], 19, { duration: 1.2 });
    }
  }, [center]);

  return (
    <div
      ref={elRef}
      className="h-[420px] w-full overflow-hidden rounded-2xl border border-oak/15 md:h-[520px]"
      role="application"
      aria-label="Map — draw your property to estimate its area"
    />
  );
}
