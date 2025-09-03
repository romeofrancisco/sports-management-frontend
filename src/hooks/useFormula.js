import {
  createFormula,
  deleteFormula,
  fetchFormulas,
  updateFormula,
} from "@/api/statsApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/context/QueryProvider";

export const useFormula = (sport, filter) => {
  return useQuery({
    queryKey: ["formulas", sport, filter],
    queryFn: () => fetchFormulas(sport, filter),
  });
};

export const useCreateFormula = (sport) => {
  return useMutation({
    mutationFn: (data) => createFormula(data),
    onSuccess: () => {
      toast.success("Formula Created", {
        richColors: true,
      });
      queryClient.invalidateQueries(["formulas", sport]);
    },
  });
};

export const useUpdateFormula = () => {
  return useMutation({
    mutationFn: ({ id, data }) => updateFormula(id, data),
    onSuccess: () => {
      toast.success("Formula Updated", {
        richColors: true,
      });
      queryClient.invalidateQueries(["formulas"]);
    },
  });
};

export const useDeleteFormula = () => {
  return useMutation({
    mutationFn: ({ id }) => deleteFormula(id),
    onSuccess: () => {
      toast.info("Formula Deleted", {
        richColors: true,
      });
      queryClient.invalidateQueries(["formulas"]);
    },
  });
};
