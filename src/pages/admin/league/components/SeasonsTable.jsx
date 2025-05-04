import { useModal } from "@/hooks/useModal";
import React, { useState } from "react";
import DataTable from "@/components/common/DataTable";
import { useNavigate } from "react-router";
import {
  Trash,
  MoreHorizontal,
  ClipboardPenLine,
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

const SeasonsTable = ({ seasons, sport, league, compact = false }) => {
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState(null);
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const {
    isOpen: isUpdateOpen,
    openModal: openUpdateModal,
    closeModal: closeUpdateModal,
  } = useModal();
  const {
    isOpen: isNewSeasonOpen,
    openModal: openNewSeasonModal,
    closeModal: closeNewSeasonModal,
  } = useModal();

  const handleDeleteSeason = (season) => {
    openDeleteModal();
    setSelectedSeason(season);
  };

  const handleUpdateSeason = (season) => {
    openUpdateModal();
    setSelectedSeason(season);
  };

  const getStatusBadge = (status) => {
    const statusStyle = {
      upcoming: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
      ongoing: "bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
      completed: "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
      canceled: "bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
      paused: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
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
          <Badge className={`${getStatusBadge(status)} capitalize`} variant="outline">
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
                onClick={() => navigate(`/leagues/${league}/season/${season.id}`)}
                className="flex items-center gap-2"
              >
                <Settings size={14} />
                Manage Season
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleUpdateSeason(season)}
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
    <div className="p-5 lg:p-6">
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Seasons
        </h2>
        {!compact && (
          <Button onClick={openNewSeasonModal} variant="default" size="sm" className="gap-1">
            <Plus size={16} />
            New Season
          </Button>
        )}
      </div>
      <DataTable
        columns={columns}
        data={seasons}
        className="text-sm"
        alternateRowColors={true}
      />
      <DeleteSeasonModal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        season={selectedSeason}
      />
      <SeasonModal
        isOpen={isUpdateOpen}
        onClose={closeUpdateModal}
        league={league}
        season={selectedSeason}
        sport={sport}
      />
      <SeasonModal
        isOpen={isNewSeasonOpen}
        onClose={closeNewSeasonModal}
        league={league}
        sport={sport}
      />
    </div>
  );
};

export default SeasonsTable;
