import { useQuery } from "@tanstack/react-query";
import { fetchSeasonLeaders } from "@/api/seasonsApi";

/**
 * Hook for fetching season leaders
 * @param {string|number} leagueId - The league ID
 * @param {string|number} seasonId - The season ID
 * @param {object} options - Additional React Query options
 * @returns {object} Query result object
 */
export const useSeasonLeaders = (leagueId, seasonId, options = {}) => {
  return useQuery({
    queryKey: ["seasonLeaders", leagueId, seasonId],
    queryFn: () => fetchSeasonLeaders(leagueId, seasonId),
    enabled: !!leagueId && !!seasonId,
    ...options,
  });
};

export default useSeasonLeaders;
