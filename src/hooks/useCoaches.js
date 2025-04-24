import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCoaches, createCoach, deleteCoach, updateCoach } from "@/api/coachesApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const useCoaches = (filter, enabled = true) => {
  return useQuery({
    queryKey: ["coaches", filter],
    queryFn: () => fetchCoaches(filter),
    enabled,
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
