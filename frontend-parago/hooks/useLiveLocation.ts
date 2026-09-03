// hooks/useLiveLocation.ts
import { useEffect, useRef, useState } from "react";
import { LatLng } from "leaflet";
import { bearing } from "../lib/geo";

export interface LiveLocation {
  position: LatLng | null;
  speedKmh: number; // km/h
  heading: number; // degrees
  error: string | null;
  trail: LatLng[]; // past positions for polyline
  simulate: boolean;
}

/**
 * Hook that wraps navigator.geolocation.watchPosition and provides smooth updates.
 * Includes a simulation mode that moves the marker along a mocked route.
 */
export function useLiveLocation(): LiveLocation {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [speedKmh, setSpeedKmh] = useState(0);
  const [heading, setHeading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [trail, setTrail] = useState<LatLng[]>([]);
  const [simulate, setSimulate] = useState(false);

  const watchIdRef = useRef<number | null>(null);
  const simulationIndexRef = useRef(0);
  const simulatedPath = useRef<LatLng[]>([ // simple square route for demo
    new LatLng(-6.2, 106.8),
    new LatLng(-6.201, 106.802),
    new LatLng(-6.202, 106.804),
    new LatLng(-6.203, 106.803),
    new LatLng(-6.202, 106.801),
    new LatLng(-6.2, 106.8),
  ]);

  // Real geolocation handling
  useEffect(() => {
    if (simulate) return; // skip real watch when simulating
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    const success = (pos: GeolocationPosition) => {
      const { latitude, longitude, speed, heading: geoHeading } = pos.coords;
      const newPos = new LatLng(latitude, longitude);
      setPosition((prev) => {
        if (prev) {
          const newHeading = bearing(prev.lat, prev.lng, latitude, longitude);
          setHeading(newHeading);
        }
        return newPos;
      });
      setSpeedKmh(speed !== null ? (speed * 3.6) : 0);
      setTrail((t) => {
        const updated = [...t, newPos];
        if (updated.length > 100) updated.shift();
        return updated;
      });
    };
    const fail = (e: GeolocationPositionError) => {
      setError(e.message);
    };
    watchIdRef.current = navigator.geolocation.watchPosition(success, fail, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    });
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [simulate]);

  // Simulation loop
  useEffect(() => {
    if (!simulate) return;
    const interval = setInterval(() => {
      const idx = simulationIndexRef.current % simulatedPath.current.length;
      const nextIdx = (idx + 1) % simulatedPath.current.length;
      const from = simulatedPath.current[idx];
      const to = simulatedPath.current[nextIdx];
      const newHeading = bearing(from.lat, from.lng, to.lat, to.lng);
      setHeading(newHeading);
      setPosition(to);
      setSpeedKmh(30); // constant mock speed
      setTrail((t) => {
        const updated = [...t, to];
        if (updated.length > 100) updated.shift();
        return updated;
      });
      simulationIndexRef.current = nextIdx;
    }, 2000);
    return () => clearInterval(interval);
  }, [simulate]);

  return {
    position,
    speedKmh,
    heading,
    error,
    trail,
    simulate,
    // expose a toggle for UI
    // Note: we cannot return functions directly in the returned object type; use a setter
    // The caller can use setSimulate via the hook's returned tuple if needed.
    // For simplicity we attach a method here.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setSimulate,
  } as LiveLocation & { setSimulate: (v: boolean) => void };
}
