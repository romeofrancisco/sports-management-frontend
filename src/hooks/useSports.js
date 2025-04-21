import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchSports,
  fetchSportDetails,
  fetchSportPositions,
  fetchPositions,
  fetchRecordableStats,
  createSport,
  updateSport,
  fetchSportStats,
  updateSportStats,
  createSportStats,
} from "@/api/sportsApi";
import { toast } from "sonner";
import { queryClient } from "@/context/QueryProvider";

export const useSports = (enabled = true) => {
  return useQuery({
    queryKey: ["sports"],
    queryFn: fetchSports,
    enabled,
  });
};

export const useCreateSport = () => {
  return useMutation({
    queryFn: (sportData) => createSport(sportData),
    onSuccess: () => {
      toast.success("New Sport Created", {
        richColors: true,
      });
      queryClient.invalidateQueries(["sports"]);
    },
  });
};

export const useUpdateSport = () => {
  return useMutation({
    queryFn: ({ id, data }) => updateSport(id, data),
    onSuccess: () => {
      toast.success("Sport Updated", {
        richColors: true,
      });
      queryClient.invalidateQueries(["sports"]);
    },
  });
};

export const useSportDetails = (sport) => {
  return useQuery({
    queryKey: ["sport", sport],
    queryFn: () => fetchSportDetails(sport),
    enabled: !!sport,
  });
};

// Fetch all positions from specific sport
export const useSportPositions = (sport) => {
  return useQuery({
    queryKey: ["positions", sport],
    queryFn: () => fetchSportPositions(sport),
    enabled: !!sport,
  });
};

// Fetch all positions from all sports
export const usePositions = (enabled = true) => {
  return useQuery({
    queryKey: ["positions"],
    queryFn: fetchPositions,
    enabled,
  });
};

// Fetch stats to record in game
export const useRecordableStats = (gameId, enabled = true) => {
  return useQuery({
    queryKey: ["recordable-stats", gameId],
    queryFn: () => fetchRecordableStats(gameId),
    enabled,
  });
};

export const useSportStats = (sport, filter) => {
  return useQuery({
    queryKey: ["sport-stats", sport, filter],
    queryFn: () => fetchSportStats(sport, filter),
    enabled: !!sport,
  });
};

export const useCreateSportStats = () => {
  return useMutation({
    mutationFn: (data) => createSportStats(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["sport-stats"]);
    },
  });
};

export const useUpdateSportStats = () => {
  return useMutation({
    mutationFn: ({ id, data }) => updateSportStats(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["sport-stats"]);
    },
  });
};
