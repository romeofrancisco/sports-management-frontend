import { useMemo } from "react";

const useFilteredTeams = (teams, sports, selectedSport) => {
  return useMemo(() => {
    // Handle paginated teams data - extract teams from results
    const teamsArray = teams?.results || teams || [];
    
    const selectedSportObj = sports.find(
      (sport) => String(sport.id) === String(selectedSport)
    );
    if (!selectedSportObj) return [];
    
    return teamsArray.filter((team) => team.sport === selectedSportObj.id);
  }, [selectedSport, sports, teams]);
};

export default useFilteredTeams;