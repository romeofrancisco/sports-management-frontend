import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leaderApi } from "@/api";
import { toast } from "sonner";

export function useLeaderCategories(sportSlug) {
  const queryClient = useQueryClient();

  // Get leader categories for a sport
  const leaderCategoriesQuery = useQuery({
    queryKey: ["leader-categories", sportSlug],
    queryFn: () => leaderApi.getBySport(sportSlug),
    enabled: Boolean(sportSlug),
  });

  // Create a new leader category
  const createLeaderCategory = useMutation({
    mutationFn: (data) => leaderApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["leader-categories", sportSlug]);
    },
    onError: (error) => {
      console.error("Error creating leader category:", error);
      throw error;
    }
  });

  // Update an existing leader category
  const updateLeaderCategory = useMutation({
    mutationFn: ({ id, data }) => leaderApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["leader-categories", sportSlug]);
    },
    onError: (error) => {
      console.error("Error updating leader category:", error);
      throw error;
    }
  });

  // Delete a leader category
  const deleteLeaderCategory = useMutation({
    mutationFn: (id) => leaderApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["leader-categories", sportSlug]);
      toast.success("Leader category deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting leader category:", error);
      toast.error("Failed to delete leader category");
    }
  });

  return {
    leaderCategories: leaderCategoriesQuery.data || [],
    isLoading: leaderCategoriesQuery.isLoading,
    isError: leaderCategoriesQuery.isError,
    error: leaderCategoriesQuery.error,
    createLeaderCategory,
    updateLeaderCategory,
    deleteLeaderCategory,
  };
}