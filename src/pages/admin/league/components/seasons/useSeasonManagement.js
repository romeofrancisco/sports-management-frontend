import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { useSeasons } from "@/hooks/useSeasons";

export const useSeasonManagement = (passedSeasons, league) => {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState("table");

  // Determine if we should use passed seasons or fetch them ourselves
  const shouldFetchSeasons = passedSeasons === undefined;

  // Use the hook only if seasons weren't passed directly
  const {
    data,
    isLoading: isLoadingSeasons,
    isError,
  } = useSeasons(shouldFetchSeasons ? league : null, currentPage, pageSize);

  // Choose data source based on whether seasons were passed or fetched
  const seasons = shouldFetchSeasons ? data?.results || [] : passedSeasons || [];
  const totalSeasons = shouldFetchSeasons ? data?.count || 0 : seasons.length;
  const isLoading = shouldFetchSeasons ? isLoadingSeasons : false;

  // Only show pagination if we're fetching seasons (not using passed data)
  const showPagination = shouldFetchSeasons && totalSeasons > 0;

  const modals = {
    delete: useModal(),
    update: useModal(),
    create: useModal(),
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleDeleteSeason = (season) => {
    setSelectedSeason(season);
    modals.delete.openModal();
  };

  const handleEditSeason = (season = null) => {
    setSelectedSeason(season);
    if (season) {
      modals.update.openModal();
    } else {
      modals.create.openModal();
    }
  };

  return {
    // Data
    seasons,
    totalSeasons,
    isLoading,
    selectedSeason,
    
    // State
    currentPage,
    pageSize,
    viewMode,
    showPagination,
    
    // Modals
    modals,
    
    // Handlers
    setViewMode,
    handlePageChange,
    handlePageSizeChange,
    handleDeleteSeason,
    handleEditSeason,
  };
};
