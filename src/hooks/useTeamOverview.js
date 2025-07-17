import { useQuery } from "@tanstack/react-query";
import api from "@/api";

export const useTeamOverview = ({ teamSlug, metricId, playerIds }) => {
  return useQuery({
    queryKey: ["teamOverview", teamSlug, metricId, playerIds],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (teamSlug) {
        params.append("team", teamSlug);
      }

      if (metricId) {
        params.append("metric_id", metricId);
      }

      if (playerIds && playerIds.length > 0) {
        params.append("player_ids", playerIds.join(","));
      }
      const response = await api.get(
        `trainings/player-progress/multi_player_overview/?${params.toString()}`
      );

      return response.data;
    },
    enabled: Boolean(
      metricId && (teamSlug || (playerIds && playerIds.length > 0))
    ),
    onError: (error) => {
      console.error("Team Overview API Error:", error);
    },
  });
};
