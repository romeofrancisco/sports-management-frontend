import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCoaches, fetchCoachById, createCoach, deleteCoach, updateCoach, reactivateCoach } from "@/api/coachesApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const useCoaches = (filter = {}, page = 1, pageSize = 12, enabled = true) => {
  const apiFilter = {
    ...filter,
    page,
    page_size: pageSize,
  };

  return useQuery({
    queryKey: ["coaches", apiFilter, page, pageSize],
    queryFn: () => fetchCoaches(apiFilter),
    enabled,
    keepPreviousData: true,
  });
};

export const useCoach = (coachId, enabled = true) => {
  return useQuery({
    queryKey: ["coach", coachId],
    queryFn: () => fetchCoachById(coachId),
    enabled: enabled && !!coachId,
  });
};

export const useCreateCoach = () => {
  return useMutation({
    mutationFn: (coachData) => createCoach(coachData),
    onSuccess: () => {
      toast.success("Coach Registered", {
        richColors: true,
      });
      queryClient.invalidateQueries(["coaches"]);
    },
  });
};

export const useUpdateCoach = () => {
  return useMutation({
    mutationFn: ({id, data}) => updateCoach(id, data),
    onSuccess: () => {
      toast.success("Coach Updated", {
        richColors: true,
      });
      queryClient.invalidateQueries(["coaches"]);
    },
  });
};

export const useDeleteCoach = () => {
  return useMutation({
    mutationFn: ({ id }) => deleteCoach(id),
    onSuccess: () => {
      toast.success("Coach Deleted", {
        richColors: true,
      });
      queryClient.invalidateQueries(["coaches"]);
    },
  });
};

export const useReactivateCoach = () => {
  return useMutation({
    mutationFn: ({ id }) => reactivateCoach(id),
    onSuccess: () => {
      toast.success("Coach Reactivated", {
        richColors: true,
      });
      queryClient.invalidateQueries(["coaches"]);
    },
  });
};
