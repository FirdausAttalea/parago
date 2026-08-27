export type Vehicle = {
    id: string;
    name: string;
    variant: string;
    tag: string;
    pricePerDay: string;
    seats: number;
    transmission: "Automatic" | "Manual";
    fuel: "Hybrid" | "Petrol" | "Diesel" | "Electric";
    image: string;
};

export type Booking = {
    id: string;
    dateRange: string;
    vehicleName: string;
    location: string;
    status: "APPROVED" | "PENDING" | "REJECTED";
    actionLabel: string;
};

export const vehicles: Vehicle[] = [
    {
        id: "v1",
        name: "Toyota Innova",
        variant: "Hybrid Zenix 2.0",
        tag: "LUXURY MPV",
        pricePerDay: "Rp200.000",
        seats: 7,
        transmission: "Automatic",
        fuel: "Hybrid",
        image: "/vehicles/toyota-innova.jpg",
    },
    {
        id: "v2",
        name: "Honda Accord",
        variant: "Sport Edition VTEC",
        tag: "EXECUTIVE SEDAN",
        pricePerDay: "Rp250.000",
        seats: 5,
        transmission: "Automatic",
        fuel: "Petrol",
        image: "/vehicles/honda-accord.jpg",
    },
];

export const bookings: Booking[] = [
    {
        id: "b1",
        dateRange: "OCT 12 - OCT 15",
        vehicleName: "BMW Series 5",
        location: "Airport Terminal 3",
        status: "APPROVED",
        actionLabel: "Details",
    },
    {
        id: "b2",
        dateRange: "OCT 18 - OCT 19",
        vehicleName: "Mercedes-Benz E-Class",
        location: "Corporate HQ",
        status: "PENDING",
        actionLabel: "Modify",
    },
];

export const currentUser = {
    name: "Marcus Chen",
    role: "DIRECTOR",
    avatar: "/avatars/marcus-chen.jpg",
};