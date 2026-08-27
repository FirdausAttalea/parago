import { create } from "zustand";

interface FleetState {
    statusFilter: "all" | "active" | "inactive" | "maintenance";
    selectedVehicleId: number | null;
    setStatusFilter: (status: FleetState["statusFilter"]) => void;
    setSelectedVehicleId: (id: number | null) => void;
}

export const useFleetStore = create<FleetState>((set) => ({
    statusFilter: "all",
    selectedVehicleId: null,
    setStatusFilter: (status) => set({ statusFilter: status }),
    setSelectedVehicleId: (id) => set({ selectedVehicleId: id }),
}));