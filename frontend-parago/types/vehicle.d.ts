export interface Vehicle {
    id: number | string;
    plate_number: string;
    brand?: string;
    model?: string | {
        id?: string;
        name?: string;
        brand_id?: string;
        brand?: {
            name?: string;
        };
    };
    year?: number;
    color?: string;
    status: "active" | "inactive" | "maintenance" | "retired" | string;
    latitude?: number;
    longitude?: number;
    driver_id?: number | string;
    driver?: {
        id: number | string;
        name: string;
    };
    created_at?: string;
    updated_at?: string;
}