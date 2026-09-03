// lib/geo.ts
// Helper functions for distance, bearing, and ETA calculations.

/** Haversine distance between two latitude/longitude points in kilometers */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Bearing (heading) from point A to point B in degrees (0 = north) */
export function bearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  const brg = (toDeg(Math.atan2(y, x)) + 360) % 360;
  return brg;
}

/** Simple ETA calculation: remaining distance (km) / speed (km/h) -> minutes */
export function estimateETA(distanceKm: number, speedKmh: number): number {
  if (speedKmh <= 0) return 0;
  const hours = distanceKm / speedKmh;
  return Math.round(hours * 60); // minutes
}
