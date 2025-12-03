import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPlayerRegistrations,
  fetchPlayerRegistration,
  approvePlayerRegistration,
  rejectPlayerRegistration,
  deletePlayerRegistration,
} from "@/api/playerRegistrationApi";
import { toast } from "sonner";

/**
 * Hook to fetch player registrations with filters
 */
export const usePlayerRegistrations = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["player-registrations", params],
    queryFn: () => fetchPlayerRegistrations(params),
    ...options,
  });
};

/**
 * Hook to fetch a single player registration
 */
export const usePlayerRegistration = (registrationId, options = {}) => {
  return useQuery({
    queryKey: ["player-registration", registrationId],
    queryFn: () => fetchPlayerRegistration(registrationId),
    enabled: !!registrationId,
    ...options,
  });
};

/**
 * Hook to approve a player registration
 */
export const useApproveRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => approvePlayerRegistration(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player-registrations"] });
      toast.success("Registration approved", {
        description: "The player has been created and notified via email.",
      });
    },
    onError: (error) => {
      const message = error.response?.data?.error || error.response?.data?.detail || "Failed to approve registration";
      toast.error("Approval failed", { description: message });
    },
  });
};

/**
 * Hook to reject a player registration
 */
export const useRejectRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => rejectPlayerRegistration(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player-registrations"] });
      toast.success("Registration rejected", {
        description: "The applicant has been notified via email.",
      });
    },
    onError: (error) => {
      const message = error.response?.data?.error || error.response?.data?.detail || "Failed to reject registration";
      toast.error("Rejection failed", { description: message });
    },
  });
};

/**
 * Hook to delete a player registration
 */
export const useDeleteRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deletePlayerRegistration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player-registrations"] });
      toast.success("Registration deleted");
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Failed to delete registration";
      toast.error("Delete failed", { description: message });
    },
  });
};
