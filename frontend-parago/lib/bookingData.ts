export type LogStatus = "SYSTEM" | "MANUAL" | "AUTO";
export type HistoryState = "done" | "active" | "pending";

export type BookingDetail = {
    id: string;
    bookingCode: string;
    status: "ACTIVE" | "COMPLETED" | "CANCELLED";
    category: string;
    vehicleName: string;
    vehicleImage: string;
    vehicleBadges: string[];
    vehicleTag: string;
    vehicleSubtitle: string;
    estimatedRevenue: number;
    revenueNote: string;
    tripProgress: { currentKm: number; totalKm: number; percent: number };
    pickup: {
        time: string;
        name: string;
        address: string;
        note?: string;
    };
    destination: {
        time: string;
        name: string;
        address: string;
    };
    vehicleSpecs: { label: string; value: string; valueColor?: string }[];
    telemetry: { label: string; value: string; valueColor?: string }[];
    systemLogs: {
        event: string;
        timestamp: string;
        identity: string;
        status: LogStatus;
    }[];
    driver: {
        name: string;
        title: string;
        photo: string;
        rating: string;
        safeMiles: string;
        online: boolean;
    };
    bookingParty: {
        name: string;
        tier: string;
        accountId: string;
        attn: string;
        phone: string;
        note: string;
    };
    statusHistory: {
        label: string;
        timestamp: string;
        source: string;
        state: HistoryState;
    }[];
};

const mercedesBooking: BookingDetail = {
    id: "PF-99281",
    bookingCode: "PF-99281",
    status: "ACTIVE",
    category: "INTRA-CITY VIP",
    vehicleName: "Mercedes-Benz S-Class",
    vehicleImage: "/vehicles/mercedes-s-class.jpg",
    vehicleBadges: ["APPROVED", "IN PROGRESS"],
    vehicleTag: "MERCEDES-BENZ S-CLASS",
    vehicleSubtitle:
        "2023 Long Wheelbase Edition • Plate: PRG-7700 • Midnight Obsidian Finish",
    estimatedRevenue: 1240,
    revenueNote: "Premium Rate Applied",
    tripProgress: { currentKm: 65.4, totalKm: 82.0, percent: 78 },
    pickup: {
        time: "08:30 AM",
        name: "Grand Peninsula Hotel, Tower A",
        address: "45 Corporate Square, Downtown Financial District, NY 10001",
        note: "Checked-in by Concierge",
    },
    destination: {
        time: "Estimated 11:45 AM",
        name: "Teterboro Private Aviation Terminal",
        address: "Hangar 4, 111 Industrial Ave, Teterboro, NJ 07608",
    },
    vehicleSpecs: [
        { label: "Transmission", value: "9G-TRONIC Auto" },
        { label: "Fuel Level", value: "84%", valueColor: "text-emerald-600" },
        { label: "Odometer", value: "12,430 km" },
        { label: "Last Service", value: "12 May 2024" },
    ],
    telemetry: [
        { label: "Cabin Temp", value: "21.5°C" },
        { label: "Current Speed", value: "42 km/h" },
        { label: "Tire Pressure", value: "Optimal", valueColor: "text-emerald-600" },
    ],
    systemLogs: [
        {
            event: "Ignition Start",
            timestamp: "08:14:22 AM",
            identity: "V-Plate 7700",
            status: "SYSTEM",
        },
        {
            event: "Passenger Onboard",
            timestamp: "08:32:01 AM",
            identity: "Driver: Marcus G.",
            status: "MANUAL",
        },
        {
            event: "Route Deviation",
            timestamp: "09:12:44 AM",
            identity: "Traffic AI",
            status: "AUTO",
        },
    ],
    driver: {
        name: "Marcus G. Sterling",
        title: "Senior Fleet Specialist • 8 yrs",
        photo: "/drivers/marcus-sterling.jpg",
        rating: "4.98 / 5.0",
        safeMiles: "224k",
        online: true,
    },
    bookingParty: {
        name: "Global Horizon Equity",
        tier: "CORPORATE TIER 1",
        accountId: "GHE-900",
        attn: "Sarah Jenkins",
        phone: "+1 (212) 555-0198",
        note: "Billing Instructions attached",
    },
    statusHistory: [
        {
            label: "Dispatch Assigned",
            timestamp: "Today, 06:45 AM",
            source: "Command",
            state: "done",
        },
        {
            label: "Vehicle Pre-check Pass",
            timestamp: "Today, 07:30 AM",
            source: "Sensors",
            state: "done",
        },
        {
            label: "En-Route to Pickup",
            timestamp: "Today, 07:45 AM",
            source: "",
            state: "active",
        },
        {
            label: "Passenger Onboard",
            timestamp: "Today, 08:32 AM",
            source: "",
            state: "active",
        },
        {
            label: "Estimated Arrival",
            timestamp: "Today, 11:45 AM",
            source: "",
            state: "pending",
        },
    ],
};

/** Simple variants so different vehicle cards on the dashboard link to distinct-looking bookings. */
const bookingsById: Record<string, BookingDetail> = {
    "pf-99281": mercedesBooking,
    v1: {
        ...mercedesBooking,
        id: "PF-88410",
        bookingCode: "PF-88410",
        category: "AIRPORT TRANSFER",
        vehicleName: "Toyota Innova",
        vehicleImage: "/vehicles/toyota-innova.jpg",
        vehicleTag: "TOYOTA INNOVA",
        vehicleSubtitle:
            "2024 Hybrid Zenix 2.0 • Plate: PRG-4410 • Pearl White Finish",
        estimatedRevenue: 340,
        revenueNote: "Standard Rate Applied",
    },
    v2: {
        ...mercedesBooking,
        id: "PF-77235",
        bookingCode: "PF-77235",
        category: "EXECUTIVE SEDAN",
        vehicleName: "Honda Accord",
        vehicleImage: "/vehicles/honda-accord.jpg",
        vehicleTag: "HONDA ACCORD",
        vehicleSubtitle:
            "2024 Sport Edition VTEC • Plate: PRG-7235 • Aegean Blue Finish",
        estimatedRevenue: 288,
        revenueNote: "Standard Rate Applied",
    },
};

export function getBookingDetail(id?: string): BookingDetail {
    if (!id) return mercedesBooking;
    return bookingsById[id.toLowerCase()] ?? mercedesBooking;
}

export const bookings = [
    {
        id: 'b1',
        vehicle: {
            name: 'Mercedes-Benz S-Class',
            type: 'Sedan',
            thumbnail: '/images/mercedes-sclass.jpg',
        },
        startDate: '2023-07-01 09:00',
        endDate: '2023-07-01 12:30',
        driver: 'Andi Wijaya',
        route: 'Jakarta - Bandung',
        status: 'ongoing',
        statusLabel: '🟢 Ongoing',
        totalCost: 'Rp1.240.000',
    },
    {
        id: 'b2',
        vehicle: {
            name: 'Toyota Innova',
            type: 'MPV',
            thumbnail: '/images/toyota-innova.jpg',
        },
        startDate: '2023-06-15 08:00',
        endDate: '2023-06-15 10:15',
        driver: 'Siti Rahma',
        route: 'Surabaya - Malang',
        status: 'completed',
        statusLabel: '🔵 Completed',
        totalCost: 'Rp560.000',
    },
    {
        id: 'b3',
        vehicle: {
            name: 'Honda Jazz',
            type: 'Hatchback',
            thumbnail: '/images/honda-jazz.jpg',
        },
        startDate: '2023-08-05 14:00',
        endDate: '2023-08-05 16:45',
        driver: 'Budi Santoso',
        route: 'Bandung - Yogyakarta',
        status: 'pending',
        statusLabel: '🟡 Pending',
        totalCost: 'Rp780.000',
    },
    {
        id: 'b4',
        vehicle: {
            name: 'Ford Ranger',
            type: 'Pickup',
            thumbnail: '/images/ford-ranger.jpg',
        },
        startDate: '2023-05-20 07:30',
        endDate: '2023-05-20 11:00',
        driver: 'Dewi Lestari',
        route: 'Semarang - Surakarta',
        status: 'cancelled',
        statusLabel: '⚪ Cancelled',
        totalCost: 'Rp0',
    },
];

/* ─────────────────────────────────────────────
   Bookings Overview – used by /dashboard/bookings
   ───────────────────────────────────────────── */

export type BookingOverviewStatus =
    | "ongoing"
    | "upcoming"
    | "completed"
    | "cancelled";

export type BookingOverviewItem = {
    id: string;
    bookingCode: string;
    status: BookingOverviewStatus;
    transactionDate: string;
    vehicle: {
        name: string;
        type: string;
        thumbnail: string;
    };
    startDate: string;
    endDate: string;
    duration: string;
    driver: string;
    route: string;
    totalCost: number;
};

export const bookingOverviews: BookingOverviewItem[] = [
    {
        id: "bov-1",
        bookingCode: "BKG-8839",
        status: "ongoing",
        transactionDate: "01 Sep 2026",
        vehicle: {
            name: "Mercedes-Benz S-Class",
            type: "Executive Sedan",
            thumbnail: "/vehicles/mercedes-s-class.jpg",
        },
        startDate: "01 Sep 2026, 08:30",
        endDate: "01 Sep 2026, 14:00",
        duration: "5h 30m",
        driver: "Marcus G. Sterling",
        route: "Grand Peninsula Hotel → Teterboro Aviation Terminal",
        totalCost: 1240,
    },
    {
        id: "bov-2",
        bookingCode: "BKG-7714",
        status: "upcoming",
        transactionDate: "30 Aug 2026",
        vehicle: {
            name: "Toyota Innova",
            type: "Luxury MPV",
            thumbnail: "/vehicles/toyota-innova.jpg",
        },
        startDate: "05 Sep 2026, 07:00",
        endDate: "05 Sep 2026, 12:30",
        duration: "5h 30m",
        driver: "Andi Wijaya",
        route: "Jakarta CBD → Bandung Conference Center",
        totalCost: 560,
    },
    {
        id: "bov-3",
        bookingCode: "BKG-6601",
        status: "completed",
        transactionDate: "28 Aug 2026",
        vehicle: {
            name: "Honda Accord",
            type: "Executive Sedan",
            thumbnail: "/vehicles/honda-accord.jpg",
        },
        startDate: "28 Aug 2026, 09:00",
        endDate: "28 Aug 2026, 13:45",
        duration: "4h 45m",
        driver: "Siti Rahma",
        route: "Surabaya HQ → Malang Industrial Park",
        totalCost: 420,
    },
    {
        id: "bov-4",
        bookingCode: "BKG-5590",
        status: "cancelled",
        transactionDate: "25 Aug 2026",
        vehicle: {
            name: "Ford Ranger",
            type: "Utility Pickup",
            thumbnail: "/vehicles/ford-ranger.jpg",
        },
        startDate: "27 Aug 2026, 06:00",
        endDate: "27 Aug 2026, 18:00",
        duration: "12h",
        driver: "Budi Santoso",
        route: "Semarang Depot → Surakarta Site",
        totalCost: 0,
    },
    {
        id: "bov-5",
        bookingCode: "BKG-4478",
        status: "completed",
        transactionDate: "22 Aug 2026",
        vehicle: {
            name: "BMW 7-Series",
            type: "VIP Sedan",
            thumbnail: "/vehicles/bmw-7-series.jpg",
        },
        startDate: "22 Aug 2026, 10:00",
        endDate: "22 Aug 2026, 16:30",
        duration: "6h 30m",
        driver: "Dewi Lestari",
        route: "Corporate Tower → Airport Terminal 3",
        totalCost: 1580,
    },
];
