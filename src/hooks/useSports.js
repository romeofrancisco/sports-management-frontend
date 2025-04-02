import { useQuery } from "@tanstack/react-query";
import { fetchSports, fetchSportDetails, fetchSportPositions, fetchPositions, fetchRecordableStats } from "@/api/sportsApi";

export const useSports = (enabled = true) => {
  return useQuery({
    queryKey: ["sports"],
    queryFn: fetchSports,
    enabled
  });
};

export const useSportDetails = (sport) => {
  return useQuery({
    queryKey: ["sport", sport],
    queryFn: () => fetchSportDetails(sport),
    enabled: !!sport
  });
};

// Fetch all positions from specific sport
export const useSportPositions = (sport, enabled = true) => {
  return useQuery({
    queryKey: ["positions", sport],
    queryFn: () => fetchSportPositions(sport),
    enabled,
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


