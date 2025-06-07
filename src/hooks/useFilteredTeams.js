import { useMemo } from "react";

const useFilteredTeams = (teams, sports, selectedSport) => {
  return useMemo(() => {
    // Handle paginated teams data - extract teams from results
    const teamsArray = teams?.results || teams || [];
    
    // If no sport is selected, return all teams
    if (!selectedSport) {
      console.log("🔍 useFilteredTeams: No sport selected, returning all teams");
      return teamsArray;
    }
    
    const selectedSportObj = sports?.find(
      (sport) => String(sport.id) === String(selectedSport)
    );
    
    if (!selectedSportObj) {
      console.log("🔍 useFilteredTeams: Sport not found, returning all teams as fallback");
      return teamsArray; // Return all teams as fallback instead of empty array
    }
    
    const filtered = teamsArray.filter((team) => team.sport === selectedSportObj.id);
    console.log(`🔍 useFilteredTeams: Filtered ${filtered.length} teams for sport ${selectedSportObj.name}`);
    
    return filtered;
  }, [selectedSport, sports, teams]);
};

export default useFilteredTeams;