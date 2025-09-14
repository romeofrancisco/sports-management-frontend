import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchSports,
  fetchSportDetails,
  fetchSportPositions,
  fetchPositions,
  fetchRecordableStats,
  createSport,
  updateSport,
  createPosition,
  updatePosition,
  deletePosition,
  deleteSport,
  reactivateSport,
} from "@/api/sportsApi";
import { toast } from "sonner";
import { queryClient } from "@/context/QueryProvider";

export const useSports = () => {
  return useQuery({
    queryKey: ["sports"],
    queryFn: fetchSports,
  });
};

export const useCreateSport = () => {
  return useMutation({
    mutationFn: (sportData) => createSport(sportData),
    onSuccess: () => {
      toast.success("New Sport Created", {
        richColors: true,
      });
      queryClient.invalidateQueries(["sports"]);
    },
  });
};

export const useUpdateSport = () => {
  return useMutation({
    mutationFn: ({ id, data }) => updateSport(id, data),
    onSuccess: () => {
      toast.success("Sport Updated", {
        richColors: true,
      });
      queryClient.invalidateQueries(["sports"]);
    },
  });
};

export const useDeleteSport = () => {
  return useMutation({
    mutationFn: (sport) => deleteSport(sport),
    onSuccess: (data) => {
      // Handle both soft delete and hard delete responses
      if (data?.status === 'deactivated') {
        toast.warning("Sport Deactivated", {
          description: "Sport has been deactivated due to existing games/data. It won't appear in new game creation.",
          richColors: true,
        });
      } else if (data?.status === 'deleted') {
        toast.success("Sport Deleted", {
          description: "Sport has been permanently deleted.",
          richColors: true,
        });
      } else {
        // Fallback for older API responses
        toast.info("Sport Deleted", {
          richColors: true,
        });
      }
      queryClient.invalidateQueries(["sports"]);
    },
    onError: (error) => {
      console.error('Delete sport error:', error);
      toast.error("Failed to Delete Sport", {
        description: "There was an error deleting the sport. It may have associated data that prevents deletion.",
        richColors: true,
      });
    },
  });
};

export const useReactivateSport = () => {
  return useMutation({
    mutationFn: (sportSlug) => reactivateSport(sportSlug),
    onSuccess: (data) => {
      if (data?.status === 'reactivated') {
        toast.success("Sport Reactivated", {
          description: `${data.sport_name} has been reactivated and is now available for new games.`,
          richColors: true,
        });
      } else if (data?.status === 'already_active') {
        toast.info("Sport Already Active", {
          description: `${data.sport_name} is already active.`,
          richColors: true,
        });
      } else {
        toast.success("Sport Reactivated", {
          richColors: true,
        });
      }
      queryClient.invalidateQueries(["sports"]);
    },
    onError: (error) => {
      console.error('Reactivate sport error:', error);
      toast.error("Failed to Reactivate Sport", {
        description: "There was an error reactivating the sport.",
        richColors: true,
      });
    },
  });
};

export const useSportDetails = (sport) => {
  return useQuery({
    queryKey: ["sport", sport],
    queryFn: () => fetchSportDetails(sport),
    enabled: !!sport,
  });
};

// Fetch all positions from specific sport
export const useSportPositions = (sport) => {
  return useQuery({
    queryKey: ["positions", sport],
    queryFn: () => fetchSportPositions(sport),
    enabled: !!sport,
  });
};

// Fetch all positions from all sports
export const usePositions = (enabled = true) => {
  return useQuery({
    queryKey: ["positions"],
    queryFn: fetchPositions,
    enabled,
  });
};

export const useCreateposition = () => {
  return useMutation({
    mutationFn: (data) => createPosition(data),
    onSuccess: () => {
      toast.success("Position Created", {
        richColors: true,
      });
      queryClient.invalidateQueries(["positions"]);
    },
  });
};

export const useUpdateposition = () => {
  return useMutation({
    mutationFn: ({ id, data }) => updatePosition(id, data),
    onSuccess: () => {
      toast.success("Position Updated", {
        richColors: true,
      });
      queryClient.invalidateQueries(["positions"]);
    },
  });
};

export const useDeletePosition = () => {
  return useMutation({
    mutationFn: (id) => deletePosition(id),
    onSuccess: () => {
      toast.info("Position Deleted", {
        richColors: true,
      });
      queryClient.invalidateQueries(["positions"]);
    },
  });
};

// Fetch stats to record in game
export const useRecordableStats = (gameId, enabled = true) => {
  return useQuery({
    queryKey: ["recordable-stats", gameId],
    queryFn: () => fetchRecordableStats(gameId),
    enabled,
  });
};

// New hook to determine scoring type for a sport
export const useSportScoringType = (sportId) => {
  // Extract the ID/slug if an object was passed
  const sportIdentifier = typeof sportId === 'object' && sportId !== null 
    ? (sportId.slug || sportId.id || sportId.sport_id || sportId._id) 
    : sportId;
  
  const { data: sportDetails, isLoading } = useSportDetails(sportIdentifier);
  
  const scoringType = sportDetails?.scoring_type || 'points';
  const isPointsScoring = scoringType === 'points';
  const isSetsScoring = scoringType === 'sets';
  
  return {
    scoringType,
    isPointsScoring,
    isSetsScoring,
    isLoading,
    sportDetails
  };
};
