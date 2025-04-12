import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCoaches, createCoach, deleteCoach } from "@/api/coachesApi";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const useCoaches = (enabled = true) => {
  return useQuery({
    queryKey: ["coaches"],
    queryFn: fetchCoaches,
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
