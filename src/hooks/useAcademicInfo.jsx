import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api";

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
  });
};

export const useUpdateAcademicInfo = () => {
  return useMutation({
    mutationFn: async ({ id, updatedAcademicInfo }) => {
      const { data } = await api.patch(
        `academic-info/${id}/`,
        updatedAcademicInfo
      );
      return data;
    },
  });
};

export const useDeleteAcademicInfo = () => {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`academic-info/${id}/`);
      return data;
    },
  });
};
