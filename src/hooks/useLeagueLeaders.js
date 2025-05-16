import { useQuery } from "@tanstack/react-query";
import { fetchLeagueLeaders } from "@/api/leaguesApi";

/**
 * Hook for fetching league leaders across all seasons in a league
 * @param {string|number} leagueId - The league ID
 * @param {object} options - Additional React Query options
 * @returns {object} Query result object
 */
export const useLeagueLeaders = (leagueId, options = {}) => {
  return useQuery({
    queryKey: ["leagueLeaders", leagueId],
    queryFn: () => fetchLeagueLeaders(leagueId),
    enabled: !!leagueId,
    ...options,
  });
};

export default useLeagueLeaders;
