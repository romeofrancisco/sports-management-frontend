import { useQuery } from '@tanstack/react-query';
import { getGameLeaders } from '../api/gamesApi';

/**
 * React hook for fetching game leader data
 * @param {string|number} gameId - The ID of the game to fetch leaders for
 * @param {Object} options - Additional options for the query
 * @returns {Object} Query result object with leaders data
 */
export const useGameLeaders = (gameId, options = {}) => {
  return useQuery({
    queryKey: ['gameLeaders', gameId],
    queryFn: () => gameId ? getGameLeaders(gameId).then(res => res.data) : null,
    enabled: !!gameId,
    refetchOnWindowFocus: false,
    ...options
  });
};