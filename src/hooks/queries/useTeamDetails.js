import { useQuery } from "@tanstack/react-query";
import { fetchTeamDetails } from "@/api/teamsApi";

export const useTeamDetails = (team) => {
  return useQuery({
    queryKey: ["team", team],
    queryFn: () => fetchTeamDetails(team),
  });
};
