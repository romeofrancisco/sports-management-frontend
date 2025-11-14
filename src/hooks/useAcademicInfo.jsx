import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api";
import { queryClient } from "@/context/QueryProvider";
import { toast } from "sonner";

export const useAcademicInfoForm = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["academic-info", params],
    queryFn: async () => {
      const { data } = await api.get("academic-info/", { params });
      // Ensure we return an array
      return Array.isArray(data) ? data : data.results || [];
    },
    ...options,
  });
};

export const useAcademicInfo = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["academic-info-paginated", params],
    queryFn: async () => {
      const { data } = await api.get("academic-info/paginated/", { params });
      // Ensure we return an array
      return data;
    },
    ...options,
  });
};

export const useCreateAcademicInfo = () => {
  return useMutation({
    mutationFn: async (newAcademicInfo) => {
      const { data } = await api.post("academic-info/", newAcademicInfo);
      return data;
    },
    onSuccess: () => {
      // Invalidate queries related to academic info
      queryClient.invalidateQueries(["academic-info"]);
      queryClient.invalidateQueries(["academic-info-paginated"]);
      toast.success("Academic info created successfully.", {
        description: "The new academic info has been added.",
        richColors: true,
      });
    },
  });
};

export const useUpdateAcademicInfo = () => {
  return useMutation({
    mutationFn: async ({ id, updatedAcademicInfo }) => {
      console.log(updatedAcademicInfo);
      const { data } = await api.patch(
        `academic-info/${id}/`,
        updatedAcademicInfo
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate queries related to academic info
      queryClient.invalidateQueries(["academic-info"]);
      queryClient.invalidateQueries(["academic-info-paginated"]);
      toast.success("Academic info updated successfully.", {
        description: "The changes have been saved.",
        richColors: true,
      });
    },
  });
};

export const useDeleteAcademicInfo = () => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`academic-info/${id}/`);
      return data;
    },
    onSuccess: () => {
      // Invalidate queries related to academic info
      queryClient.invalidateQueries(["academic-info"]);
      queryClient.invalidateQueries(["academic-info-paginated"]);
      toast.success("Academic info deleted successfully.", {
        description: "The academic info has been removed.",
        richColors: true,
      });
    },
  });
};
