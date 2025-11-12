import { createEvent, deleteEvent, getEvents, updateEvent } from "@/api/eventsApi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/context/QueryProvider";

export const useEvents = (options = {}) => {
  return useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    ...options,
  });
};

export const useCreateEvent = (options = {}) => {
  return useMutation({
    mutationFn: (data) => {
      return createEvent(data);
    },
    onSuccess: (data, variables, context) => {
      // Invalidate the events query so the list refetches with server data
      queryClient.invalidateQueries(["events"]);
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
};

export const useUpdateEvent = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => {
      return updateEvent(id, data);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(["events"]);
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
};

export const useDeleteEvent = (options = {}) => {
  return useMutation({
    mutationFn: (id) => {
      return deleteEvent(id);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(["events"]);
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      if (options.onError) options.onError(err);
    },
    ...options,
  });
};
