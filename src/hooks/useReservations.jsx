import { getReservations, createReservation, updateReservation, deleteReservation } from "@/api/reservationsApi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/context/QueryProvider";

export const useReservations = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["reservations", params],
    queryFn: () => getReservations(params),
    ...options,
  });
};

export const useCreateReservation = (options = {}) => {
  return useMutation({
    mutationFn: (data) => createReservation(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(["reservations"]);
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
};

export const useUpdateReservation = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => updateReservation(id, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(["reservations"]);
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
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
};
