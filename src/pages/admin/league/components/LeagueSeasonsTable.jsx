import { useModal } from "@/hooks/useModal";
import React, { useState } from "react";
import DataTable from "@/components/common/DataTable";
import { useNavigate } from "react-router";
import { useSeasons } from "@/hooks/useSeasons";
import {
  Trash,
  MoreHorizontal,
  SquarePen,
  Settings,
  Calendar,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatShortDate } from "@/utils/formatDate";
import DeleteSeasonModal from "@/components/modals/DeleteSeasonModal";
import SeasonModal from "@/components/modals/SeasonModal";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router";
import TablePagination from "@/components/ui/table-pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LeagueSeasonsTable = ({ seasons: passedSeasons, sport, compact = false }) => {
  const { league } = useParams();
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Determine if we should use passed seasons or fetch them ourselves
  const shouldFetchSeasons = passedSeasons === undefined;
  
  // Use the hook only if seasons weren't passed directly
  const { data, isLoading: isLoadingSeasons, isError } = useSeasons(
    shouldFetchSeasons ? league : null, 
    currentPage, 
    pageSize
  );
  
  // Choose data source based on whether seasons were passed or fetched
  const seasons = shouldFetchSeasons ? data?.results || [] : passedSeasons || [];
  const totalSeasons = shouldFetchSeasons ? data?.count || 0 : seasons.length;
  const isLoading = shouldFetchSeasons ? isLoadingSeasons : false;

  // Only show pagination if we're fetching seasons (not using passed data)
  const showPagination = shouldFetchSeasons && totalSeasons > 0;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };
  
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const modals = {
    delete: useModal(),
    update: useModal(),
    create: useModal(),
  };

  const handleDeleteSeason = (season) => {
    setSelectedSeason(season);
    modals.delete.openModal();
  };

  const handleSeason = (season = null) => {
    setSelectedSeason(season);
    if (season) {
      modals.update.openModal();
    } else {
      modals.create.openModal();
    }
  };
  const getStatusBadge = (status) => {
    const statusStyle = {
      upcoming:
        "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
      ongoing:
        "bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
      completed:
        "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
      canceled:
        "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
      paused:
        "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
    };

    return statusStyle[status] || "bg-muted text-muted-foreground";
  };

  const columns = [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.name || `Season ${row.original.year}`}
        </div>
      ),
      size: 150,
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            className={`${getStatusBadge(status)} capitalize`}
            variant="outline"
          >
            {status}
          </Badge>
        );
      },
      size: 120,
    },
    {
      id: "date",
      header: "Date",
      cell: ({ row }) => {
        const { start_date, end_date } = row.original;
        return (
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-muted-foreground" />
            <span>{formatShortDate(start_date)}</span>
          </div>
        );
      },
      size: 120,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const season = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/leagues/${league}/season/${season.id}`)
                }
                className="flex items-center gap-2"
              >
                <Settings size={14} />
                Manage Season
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSeason(season)}
                className="flex items-center gap-2"
              >
                <SquarePen size={14} />
                Edit Season
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDeleteSeason(season)}
                className="text-red-600 dark:text-red-400 flex items-center gap-2"
              >
                <Trash size={14} />
                Delete Season
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>
      
      <CardHeader className="relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
                Seasons
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Season history and management
              </p>
            </div>
          </div>
          {!compact && (
            <Button
              onClick={() => handleSeason()}
              variant="default"
              size="sm"
              className="gap-1"
            >
              <Plus size={16} />
              New Season
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative p-6">
        <DataTable
          columns={columns}
          data={seasons}
          className="text-sm"
          alternateRowColors={true}
          loading={isLoading}
          showPagination={false} // Disable built-in pagination
          pageSize={pageSize} // Still pass pageSize for row rendering
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

export default LeagueSeasonsTable;
