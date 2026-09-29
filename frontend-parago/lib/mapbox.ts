// lib/mapbox.ts
// Mapbox Geocoding + Directions API wrappers using NEXT_PUBLIC_MAPBOX_TOKEN

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const BASE_GEOCODE = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const BASE_DIRECTIONS = "https://api.mapbox.com/directions/v5/mapbox/driving";

if (!TOKEN) {
  console.warn("[mapbox] NEXT_PUBLIC_MAPBOX_TOKEN not set — map features will fail");
}

interface GeocodeFeature {
  place_name: string;
  center: [number, number];
  properties?: { address?: string; context?: unknown[] };
}

interface GeocodeResponse {
  features: GeocodeFeature[];
}

interface DirectionsResponse {
  routes: Array<{
    geometry: GeoJSON.LineString;
    distance: number;
    duration: number;
  }>;
}

export interface Coord {
  lng: number;
  lat: number;
}

export interface LocationResult {
  label: string;
  lng: number;
  lat: number;
  address?: string;
}

export interface RouteResult {
  geometry: GeoJSON.LineString;
  distanceKm: number;
  durationMin: number;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Mapbox ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export async function geocodeForward(query: string, proximity?: Coord): Promise<LocationResult[]> {
  if (!TOKEN) throw new Error("Mapbox token missing");
  const params = new URLSearchParams({
    access_token: TOKEN,
    limit: "5",
    language: "en",
  });
  if (proximity) {
    params.set("proximity", `${proximity.lng},${proximity.lat}`);
  }
  const url = `${BASE_GEOCODE}/${encodeURIComponent(query)}.json?${params}`;
  const data = await fetchJson<GeocodeResponse>(url);
  return data.features.map((f) => ({
    label: f.place_name,
    lng: f.center[0],
    lat: f.center[1],
    address: f.properties?.address,
  }));
}

export async function geocodeReverse(lng: number, lat: number): Promise<LocationResult | null> {
  if (!TOKEN) throw new Error("Mapbox token missing");
  const params = new URLSearchParams({ access_token: TOKEN, limit: "1", language: "en" });
  const url = `${BASE_GEOCODE}/${lng},${lat}.json?${params}`;
  const data = await fetchJson<GeocodeResponse>(url);
  if (data.features.length === 0) return null;
  const f = data.features[0];
  return {
    label: f.place_name,
    lng: f.center[0],
    lat: f.center[1],
    address: f.properties?.address,
  };
}

export async function fetchRoute(from: Coord, to: Coord): Promise<RouteResult> {
  if (!TOKEN) throw new Error("Mapbox token missing");
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const params = new URLSearchParams({
    access_token: TOKEN,
    geometries: "geojson",
    overview: "full",
    steps: "false",
  });
  const url = `${BASE_DIRECTIONS}/${coords}?${params}`;
  const data = await fetchJson<DirectionsResponse>(url);
  if (!data.routes || data.routes.length === 0) {
    throw new Error("No route found");
  }
  const r = data.routes[0];
  return {
    geometry: r.geometry,
    distanceKm: r.distance / 1000,
    durationMin: Math.round(r.duration / 60),
  };
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}