import React from "react";
import DataTable from "@/components/common/DataTable";
import SeasonCard from "./SeasonCard";
import SeasonCardSkeleton from "./SeasonCardSkeleton";

const   SeasonsContent = ({ 
  viewMode, 
  seasons, 
  isLoading, 
  pageSize,
  columns,
  onEdit,
  onDelete,
  getStatusBadge
}) => {
  if (viewMode === "table") {
    return (
      <DataTable
        columns={columns}
        data={seasons}
        className="text-sm"
        alternateRowColors={true}
        loading={isLoading}
        showPagination={false}
        pageSize={pageSize}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {isLoading ? (
        <SeasonCardSkeleton pageSize={pageSize} />
      ) : seasons.length === 0 ? (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No seasons found
        </div>
      ) : (
        seasons.map((season) => (
          <SeasonCard 
            key={season.id} 
            season={season} 
            onEdit={onEdit}
            onDelete={onDelete}
            getStatusBadge={getStatusBadge}
          />
        ))
      )}
    </div>
  );
};

export default SeasonsContent;
