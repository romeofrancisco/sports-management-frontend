import React from "react";
import { useParams } from "react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import TablePagination from "@/components/ui/table-pagination";
import DeleteSeasonModal from "@/components/modals/DeleteSeasonModal";
import SeasonModal from "@/components/modals/SeasonModal";

// Component imports
import SeasonsHeader from "./SeasonsHeader";
import SeasonsContent from "./SeasonsContent";
import { useSeasonTableColumns } from "./useSeasonTableColumns";
import { useSeasonManagement } from "./useSeasonManagement";
import { getStatusBadge } from "./seasonUtils";

const LeagueSeasons = ({ seasons: passedSeasons, sport, compact = false }) => {
  const { league } = useParams();
  const { isAdmin } = useRolePermissions();

  // Use custom hook for season management
  const {
    seasons,
    totalSeasons,
    isLoading,
    selectedSeason,
    currentPage,
    pageSize,
    viewMode,
    showPagination,
    modals,
    setViewMode,
    handlePageChange,
    handlePageSizeChange,
    handleDeleteSeason,
    handleEditSeason,
  } = useSeasonManagement(passedSeasons, league);

  // Get table columns
  const columns = useSeasonTableColumns(
    handleEditSeason,
    handleDeleteSeason,
    getStatusBadge
  );

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="relative">
        <SeasonsHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          compact={compact}
          isAdmin={isAdmin}
          onCreateSeason={() => handleEditSeason()}
        />
      </CardHeader>

      <CardContent className="relative">
        <SeasonsContent
          viewMode={viewMode}
          seasons={seasons}
          isLoading={isLoading}
          pageSize={pageSize}
          columns={columns}
          onEdit={handleEditSeason}
          onDelete={handleDeleteSeason}
          getStatusBadge={getStatusBadge}
        />

        {showPagination && (
          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalSeasons}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoading}
            itemName="seasons"
          />
        )}
      </CardContent>

      {/* Modals */}
      <DeleteSeasonModal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.closeModal}
        season={selectedSeason}
      />
      <SeasonModal
        isOpen={modals.update.isOpen || modals.create.isOpen}
        onClose={
          modals.update.isOpen
            ? modals.update.closeModal
            : modals.create.closeModal
        }
        season={selectedSeason}
        sport={sport}
      />
    </Card>
  );
};

export default LeagueSeasons;
