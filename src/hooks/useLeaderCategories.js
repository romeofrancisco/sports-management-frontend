import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leaderApi } from "@/api";
import { useParams } from "react-router";

export const useLeaderCategories = () => {
  const queryClient = useQueryClient();
  const { sport: sportSlug } = useParams();

  // Get all leader categories
  const getLeaderCategories = (params = {}) => {
    return useQuery({
      queryKey: ['leaderCategories', params],
      queryFn: () => leaderApi.getAll(params),
      enabled: !!params,
    });
  };

  // Get leader categories by sport
  const getLeaderCategoriesBySport = (sportSlug, leaderType = null) => {
    return useQuery({
      queryKey: ['leaderCategories', sportSlug, leaderType],
      queryFn: () => leaderApi.getBySport(sportSlug, leaderType),
      enabled: !!sportSlug,
    });
  };

  // Get a single leader category
  const getLeaderCategory = (id) => {
    return useQuery({
      queryKey: ['leaderCategory', id],
      queryFn: () => leaderApi.get(id),
      enabled: !!id,
    });
  };

  // Create a new leader category
  const createLeaderCategory = useMutation({
    mutationFn: (data) => leaderApi.create(data),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['leaderCategories', sportSlug] });
    },
  });

  // Update an existing leader category
  const updateLeaderCategory = useMutation({
    mutationFn: ({ id, data }) => leaderApi.update(id, data),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['leaderCategories', sportSlug] });
    },
  });

  // Delete a leader category
  const deleteLeaderCategory = useMutation({
    mutationFn: (id) => leaderApi.delete(id),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['leaderCategories', sportSlug] });
    },
  });

  return {
    getLeaderCategories,
    getLeaderCategoriesBySport,
    getLeaderCategory,
    createLeaderCategory,
    updateLeaderCategory,
    deleteLeaderCategory,
    isLoading: 
      createLeaderCategory.isPending || 
      updateLeaderCategory.isPending || 
      deleteLeaderCategory.isPending,
  };
};

export default useLeaderCategories;