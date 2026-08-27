import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Vehicle } from "@/types/vehicle";

export function useVehicles() {
    return useQuery({
        queryKey: ["vehicles"],
        queryFn: async () => {
            const { data } = await api.get<Vehicle[]>("/vehicles");
            return data;
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