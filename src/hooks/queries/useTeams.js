import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "@/api/teamsApi";

export const useTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: () => fetchTeams(),
  });
};
