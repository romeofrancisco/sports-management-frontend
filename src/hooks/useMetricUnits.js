import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMetricUnits,
  fetchMetricUnit,
  createMetricUnit,
  updateMetricUnit,
  deleteMetricUnit,
  reactivateMetricUnit,
} from "../api/trainingsApi";
import { toast } from "sonner";

export function useMetricUnits(params = {}) {
  return useQuery({
    queryKey: ["metricUnits", params],
    queryFn: () => fetchMetricUnits(params),
  });
}

export function useMetricUnit(id) {
  return useQuery({
    queryKey: ["metricUnit", id],
    queryFn: () => fetchMetricUnit(id),
    enabled: !!id,
  });
}

export function useCreateMetricUnit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createMetricUnit,
    onSuccess: () => {
      toast.success("Unit created successfully");
      queryClient.invalidateQueries({ queryKey: ["metricUnits"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.detail || 
        "Failed to create unit"
      );
    },
  });
}

export function useUpdateMetricUnit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateMetricUnit,
    onSuccess: (data) => {
      toast.success("Unit updated successfully");
      queryClient.invalidateQueries({ queryKey: ["metricUnits"] });
      queryClient.invalidateQueries({ queryKey: ["metricUnit", data.id] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.detail || 
        "Failed to update unit"
      );
    },
  });
}

export function useDeleteMetricUnit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteMetricUnit,
    onSuccess: () => {
      toast.success("Unit deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["metricUnits"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.detail || 
        "Failed to delete unit"
      );
    },
  });
}
export function useReactivateMetricUnit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reactivateMetricUnit,
    onSuccess: (data) => {
      toast.success("Unit reactivated successfully", {
        description: `${data.unit_name} has been reactivated.`,
        richColors: true,
      });
      queryClient.invalidateQueries({ queryKey: ["metricUnits"] });
    },
    onError: (error) => {
      toast.error(
        "Failed to reactivate unit",
        {
          description: error.response?.data?.detail || error.message,
        }
      );
    },
  });
}