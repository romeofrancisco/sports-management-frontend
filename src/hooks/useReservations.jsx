import {
  getReservations,
  getReservationsRaw,
  createReservation,
  updateReservation,
  deleteReservation,
} from "@/api/reservationsApi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const useReservations = (params = {}, options = {}) => {
  const raw = options.raw === true;
  // Avoid passing custom option to useQuery
  const queryOptions = { ...options };
  delete queryOptions.raw;

  return useQuery({
    queryKey: ["reservations", params, raw ? "raw" : "items"],
    queryFn: () => (raw ? getReservationsRaw(params) : getReservations(params)),
    ...queryOptions,
  });
};

export const useCreateReservation = (options = {}) => {
  return useMutation({
    mutationFn: (data) => createReservation(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(["reservations"]);
      toast.success("Reservation created successfully", {
        description: "The reservation has been successfully created.",
        richColors: true,
      });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
};

export const useUpdateReservation = (options = {}, params = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => updateReservation(id, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(["reservations", params]);

      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
};

export const useDeleteReservation = (options = {}) => {
  return useMutation({
    mutationFn: (id) => deleteReservation(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(["reservations"]);
      toast.info("Reservation deleted successfully", {
        description: "The reservation has been successfully deleted.",
        richColors: true,
      });
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
};
