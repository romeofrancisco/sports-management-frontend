import { useQuery } from "@tanstack/react-query";
import { fetchGameFlow } from "@/api/charts";

export const useGameFlow = (gameId) => {
    return useQuery({
        queryKey: ["game-flow", gameId],
        queryFn: () => fetchGameFlow(gameId)
    })
}