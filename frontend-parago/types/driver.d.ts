export interface Driver {
    id: string;
    name: string;
    license_no: string;
    phone: string;
    status: "available" | "on_duty" | "resigned";
    created_at: string;
    updated_at: string;
}