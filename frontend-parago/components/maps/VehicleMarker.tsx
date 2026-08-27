import { Marker, Popup } from "react-leaflet";
import { Vehicle } from "@/types/vehicle";

export function VehicleMarker({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Marker position={[vehicle.latitude, vehicle.longitude]}>
      <Popup>
        <p className="font-semibold">{vehicle.plate_number}</p>
        <p>{vehicle.brand} {vehicle.model}</p>
        <p>Status: {vehicle.status}</p>
        {vehicle.driver && <p>Pengemudi: {vehicle.driver.name}</p>}
      </Popup>
    </Marker>
  );
}