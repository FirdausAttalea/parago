export interface Vehicle {
    id: number;
    plate_number: string;
    brand: string;
    model: string;
    status: "active" | "inactive" | "maintenance";
    latitude: number;
    longitude: number;
    driver_id?: number;
    driver?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}