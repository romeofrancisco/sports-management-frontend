import { useMemo } from "react";

const useFilteredTeams = (teams, sports, selectedSport) => {
  return useMemo(() => {
    const selectedSportObj = sports.find(
      (sport) => String(sport.id) === String(selectedSport)
    );
    if (!selectedSportObj) return [];
    return teams.filter((team) => team.sport === selectedSportObj.id);
  }, [selectedSport, sports, teams]);
};

export default useFilteredTeams;