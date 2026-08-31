export type Vehicle = {
    id: string;
    name: string;
    variant: string;
    tag: string;
    pricePerDay: number;
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
        pricePerDay: 850000,
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
        pricePerDay: 720000,
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

export type NotificationType =
    | "approved"
    | "ready"
    | "policy"
    | "maintenance";

export type Notification = {
    id: string;
    type: NotificationType;
    title: string;
    timestamp: string;
    description: string;
    actions: { label: string; variant: "primary" | "muted" }[];
};

export const notifications: Notification[] = [
    {
        id: "n1",
        type: "approved",
        title: "Booking Approved",
        timestamp: "JUST NOW",
        description:
            "Booking **#PRG-9920** for Mercedes S-Class has been confirmed by fleet management.",
        actions: [
            { label: "VIEW DETAILS", variant: "primary" },
            { label: "DISMISS", variant: "muted" },
        ],
    },
    {
        id: "n2",
        type: "ready",
        title: "Vehicle Ready",
        timestamp: "14 MIN AGO",
        description:
            "Asset **V-402** (Range Rover Vogue) has cleared inspection and is ready for dispatch at Gate 4.",
        actions: [{ label: "DISPATCH ASSET", variant: "primary" }],
    },
    {
        id: "n3",
        type: "policy",
        title: "Policy Update",
        timestamp: "2H AGO",
        description:
            "The **Inter-State Transit Policy** has been updated for Q3 operations. Please review the new toll guidelines.",
        actions: [{ label: "READ DOCUMENT", variant: "primary" }],
    },
    {
        id: "n4",
        type: "maintenance",
        title: "Maintenance Overdue",
        timestamp: "5H AGO",
        description:
            "BMW 7-Series **(Asset #202)** requires immediate brake service. Booking blocked.",
        actions: [{ label: "SCHEDULE SERVICE", variant: "primary" }],
    },
];

export const currentUser = {
    name: "Marcus Chen",
    role: "DIRECTOR",
    avatar: "/avatars/marcus-chen.jpg",
};