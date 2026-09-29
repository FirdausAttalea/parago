import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Vehicle } from "@/types/vehicle";

export function useVehicles() {
    return useQuery({
        queryKey: ["vehicles"],
        queryFn: async () => {
            const res = await api.get("/vehicles");
            // Backend returns response envelope: { success: true, data: [...] }
            const payload = res.data;
            if (payload && Array.isArray(payload.data)) {
                return payload.data as Vehicle[];
            }
            if (Array.isArray(payload)) {
                return payload as Vehicle[];
            }
            return [];
        },
    });
}

export function useCreateVehicle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newVehicle: Partial<Vehicle>) => {
            const { data } = await api.post<Vehicle>("/vehicles", newVehicle);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
        },
    });
}