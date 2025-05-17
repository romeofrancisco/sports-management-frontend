import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchMultiPlayerProgress } from "@/api/trainingsApi";

/**
 * A custom hook that fetches progress data for multiple players in a single API call.
 * This is an optimized version compared to the original approach that makes separate
 * API requests for each player.
 * 
 * The hook supports two main modes:
 * 1. Fetch by team slug (for all players in a team) - RECOMMENDED
 * 2. Fetch by player IDs (for specific players from any team)
 * 3. A combination (specific players within a team)
 * 
 * @param {Object} options - Configuration options
 * @param {Array} options.players - Array of player objects with user_id property (optional if teamSlug is provided)
 * @param {string} options.teamSlug - Team slug to fetch all players from (RECOMMENDED)
 * @param {Object} options.filters - Filters including metric, date_from, date_to
 * @param {boolean} options.enabled - Whether the query should automatically run
 * @returns {Object} Query result containing data, isLoading, error, etc.
 */
export const useMultiPlayerProgress = (options = {}) => {
  const { players = [], teamSlug = null, filters = {}, enabled = true } = options;
  
  // Extract player IDs from player objects only when we need them
  const playerIds = useMemo(() => {
    // If we have a teamSlug, we don't need to extract playerIds as the API will fetch all players in the team
    if (teamSlug) return [];
    
    // Otherwise, extract playerIds from player objects
    return players.map(player => player.user_id || player.id).filter(Boolean);
  }, [players, teamSlug]);

  const hasPlayerIds = playerIds.length > 0;
  const hasTeamSlug = !!teamSlug;
  const hasValidRequest = hasTeamSlug || hasPlayerIds; // Team slug is sufficient even without player IDs

  // Use TanStack Query's useQuery hook with our new API function
  return useQuery({
    queryKey: ["multi-player-progress", teamSlug, playerIds, filters],
    queryFn: () => fetchMultiPlayerProgress({ 
      teamSlug, 
      playerIds, // We've already excluded playerIds when teamSlug is provided
      ...filters 
    }),
    enabled: enabled && hasValidRequest && !!filters.metric,
    // Don't refetch on window focus for better performance
    refetchOnWindowFocus: false,
  });
};

export default useMultiPlayerProgress;
