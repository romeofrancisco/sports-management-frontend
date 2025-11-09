import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { updateGameScores, updateGameStatus } from "@/store/slices/gameSlice";

export const useGameScoreWebSocket = (gameId, onScoreUpdate = null, onStatusUpdate = null) => {
  const websocketRef = useRef(null);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const onScoreUpdateRef = useRef(onScoreUpdate);
  const onStatusUpdateRef = useRef(onStatusUpdate);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Update the refs when callbacks change to avoid stale closures
  useEffect(() => {
    onScoreUpdateRef.current = onScoreUpdate;
  }, [onScoreUpdate]);

  useEffect(() => {
    onStatusUpdateRef.current = onStatusUpdate;
  }, [onStatusUpdate]);

  const connectWebSocket = useCallback(() => {
    if (!gameId) return;

    // Close existing connection
    if (websocketRef.current) {
      websocketRef.current.close();
    }

    // Use environment variable for WebSocket URL
    const wsBaseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

    // WebSocket URL - cookies will be sent automatically
    let wsUrl = `${wsBaseUrl}/ws/games/${gameId}/`;

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "score_update") {        // Update React Query cache for game details
        queryClient.setQueryData(
          ['game', gameId.toString()],
          (oldData) => {
            if (!oldData) return oldData;
            
            return {
              ...oldData,
              home_team_score: data.home_team_score,
              away_team_score: data.away_team_score,
              status: data.status,
              current_period: data.current_period,
              sport_scoring_type: data.sport_scoring_type || oldData.sport_scoring_type,
            };
          }
        );        // Update Redux store if available - merge with existing data
        dispatch(updateGameScores({
          home_team_score: data.home_team_score,
          away_team_score: data.away_team_score,
          status: data.status,
          current_period: data.current_period,
          sport_scoring_type: data.sport_scoring_type,
        }));

        // Update all season-games cache entries that contain this game WITHOUT invalidating
        const queryCache = queryClient.getQueryCache();
        const seasonGameQueries = queryCache.findAll({ queryKey: ['season-games'] });
          seasonGameQueries.forEach((query) => {
          if (query.state.data && Array.isArray(query.state.data)) {
            const updatedData = query.state.data.map(game => {
              if (game.id === parseInt(gameId)) {
                return {
                  ...game,
                  home_team_score: data.home_team_score,
                  away_team_score: data.away_team_score,
                  status: data.status,
                  current_period: data.current_period,
                  sport_scoring_type: data.sport_scoring_type || game.sport_scoring_type,
                };
              }
              return game;
            });
            
            queryClient.setQueryData(query.queryKey, updatedData);
          }
        });        // Update general games cache entries WITHOUT invalidating
        const gameQueries = queryCache.findAll({ queryKey: ['games'] });
        gameQueries.forEach((query) => {
          if (query.state.data && Array.isArray(query.state.data)) {
            const updatedData = query.state.data.map(game => {
              if (game.id === parseInt(gameId)) {
                return {
                  ...game,
                  home_team_score: data.home_team_score,
                  away_team_score: data.away_team_score,
                  status: data.status,
                  current_period: data.current_period,
                  sport_scoring_type: data.sport_scoring_type || game.sport_scoring_type,
                };
              }
              return game;
            });
            
            queryClient.setQueryData(query.queryKey, updatedData);
          }
        });        // Call custom onScoreUpdate callback if provided
        if (onScoreUpdateRef.current && typeof onScoreUpdateRef.current === 'function') {
          onScoreUpdateRef.current({
            gameId: data.game_id,
            homeScore: data.home_team_score,
            awayScore: data.away_team_score,
            homeTeamId: data.home_team_id,
            awayTeamId: data.away_team_id,
            homeTeamName: data.home_team_name,
            awayTeamName: data.away_team_name,
            status: data.status,
            currentPeriod: data.current_period,
            sportScoringType: data.sport_scoring_type,
            timestamp: data.timestamp
          });
        }
      }

      if (data.type === "game_status_update") {
        // Update React Query cache for game status
        queryClient.setQueryData(
          ['game', gameId.toString()],
          (oldData) => {
            if (!oldData) return oldData;
            
            return {
              ...oldData,
              status: data.status,
              current_period: data.current_period,
              started_at: data.started_at,
              ended_at: data.ended_at,
            };
          }
        );

        // Update Redux store
        dispatch(updateGameStatus({
          status: data.status,
          current_period: data.current_period,
          started_at: data.started_at,
          ended_at: data.ended_at,
        }));

        // Update all season-games cache entries that contain this game WITHOUT invalidating
        const queryCache = queryClient.getQueryCache();
        const seasonGameQueries = queryCache.findAll({ queryKey: ['season-games'] });
        
        seasonGameQueries.forEach((query) => {
          if (query.state.data && Array.isArray(query.state.data)) {
            const updatedData = query.state.data.map(game => {
              if (game.id === parseInt(gameId)) {
                return {
                  ...game,
                  status: data.status,
                  current_period: data.current_period,
                  started_at: data.started_at,
                  ended_at: data.ended_at,
                };
              }
              return game;
            });
            
            queryClient.setQueryData(query.queryKey, updatedData);
          }
        });

        // Update general games cache entries WITHOUT invalidating
        const gameQueries = queryCache.findAll({ queryKey: ['games'] });
        gameQueries.forEach((query) => {
          if (query.state.data && Array.isArray(query.state.data)) {
            const updatedData = query.state.data.map(game => {
              if (game.id === parseInt(gameId)) {
                return {
                  ...game,
                  status: data.status,
                  current_period: data.current_period,
                  started_at: data.started_at,
                  ended_at: data.ended_at,
                };
              }
              return game;
            });
            
            queryClient.setQueryData(query.queryKey, updatedData);
          }
        });

        // Call custom onStatusUpdate callback if provided
        if (onStatusUpdateRef.current && typeof onStatusUpdateRef.current === 'function') {
          onStatusUpdateRef.current({
            gameId: data.game_id,
            status: data.status,
            currentPeriod: data.current_period,
            startedAt: data.started_at,
            endedAt: data.ended_at,
            timestamp: data.timestamp
          });
        }
      }
    };

    ws.onclose = (event) => {
      // Attempt to reconnect if not a normal closure
      if (
        event.code !== 1000 &&
        reconnectAttemptsRef.current < maxReconnectAttempts
      ) {
        reconnectAttemptsRef.current++;
        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttemptsRef.current),
          30000
        );

        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, delay);
      }
    };

    ws.onerror = (error) => {
      console.error("Game WebSocket error:", error);
    };

    ws.onopen = () => {
      reconnectAttemptsRef.current = 0;
    };

    websocketRef.current = ws;
  }, [gameId, queryClient, dispatch]);

  const disconnect = useCallback(() => {
    // Clear any pending reconnection attempts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (websocketRef.current) {
      websocketRef.current.close(1000, "Component unmounting"); // Normal closure
      websocketRef.current = null;
    }

    reconnectAttemptsRef.current = 0;
  }, []);

  useEffect(() => {
    connectWebSocket();
    return disconnect;
  }, [connectWebSocket, disconnect]);

  return {
    disconnect,
    isConnected: websocketRef.current?.readyState === WebSocket.OPEN,
  };
};
