import { useState, useMemo } from "react";
import { useGetTeamsQuery } from "../api/teamsApi";
import { useGetPlayersQuery } from "../api/playersApi";

/**
 * Custom hook to manage Training Dashboard state
 */
export const useTrainingDashboard = () => {
  const [activeTab, setActiveTab] = useState("sessions");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);

  // Get teams for filter
  const { data: teams = [] } = useGetTeamsQuery({});

  // Get players based on selected team - only fetch when needed
  const { data: players = [] } = useGetPlayersQuery(
    { team: selectedTeamId || undefined },
    { skip: activeTab !== "progress" && activeTab !== "analytics" }
  );

  // Memoize filtered players for better performance
  const filteredPlayers = useMemo(() => {
    return players.filter(p => !selectedTeamId || p.team_id === selectedTeamId);
  }, [players, selectedTeamId]);  // Handle team selection
  const handleTeamChange = (teamSlug) => {
    if (teamSlug === "all_teams") {
      setSelectedTeamId(undefined); // Use undefined instead of empty string to avoid filters
    } else {
      setSelectedTeamId(teamSlug);
    }
    setSelectedPlayerId("");
    setSelectedPlayerIds([]);
  };

  // Toggle player selection for multi-player view
  const togglePlayerSelection = (playerId) => {
    if (selectedPlayerIds.includes(playerId)) {
      setSelectedPlayerIds(selectedPlayerIds.filter((id) => id !== playerId));
    } else {
      setSelectedPlayerIds([...selectedPlayerIds, playerId]);
    }
  };

  // Quick actions for player selection
  const handleQuickPlayerSelection = (action) => {
    if (action === "all") {
      setSelectedPlayerIds(players.map((p) => p.id));
    } else if (action === "none") {
      setSelectedPlayerIds([]);
    }
  };

  return {
    // State
    activeTab,
    selectedTeamId,
    selectedPlayerId, 
    selectedPlayerIds,
    teams,
    players,
    filteredPlayers,

    // Actions
    setActiveTab,
    setSelectedTeamId,
    setSelectedPlayerId,
    setSelectedPlayerIds,
    handleTeamChange,
    togglePlayerSelection,
    handleQuickPlayerSelection
  };
};

export default useTrainingDashboard;
