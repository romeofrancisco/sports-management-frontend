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
import CreateUpdateSeasonModal from "@/components/modals/CreateUpdateSeasonModal";

const SeasonsTable = ({ seasons, sport, league }) => {
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

  const handleDeleteSeason = (season) => {
    openDeleteModal();
    setSelectedSeason(season);
  };

  const handleUpdateSeason = (season) => {
    openUpdateModal();
    setSelectedSeason(season);
  };

  const columns = [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => row.original.name,
      size: 80,
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.status.charAt(0).toUpperCase() +
        row.original.status.slice(1),
      size: 50,
    },
    {
      id: "date",
      header: "Date",
      cell: ({ row }) => {
        const { start_date, end_date } = row.original;
        return `${formatShortDate(start_date)}`;
      },
      size: 100,
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
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate(`/leagues/${league}/season/${season.id}`)}
              >
                <Settings />
                Manage Season
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateSeason(season)}>
                <SquarePen />
                Update Season
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDeleteSeason(season)}
              >
                <Trash />
                Delete Season
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 30,
    },
  ];

  return (
    <div className="dark:bg-muted/30 bg-muted/50 p-5 lg:p-8 rounded-lg">
      <h1 className="text-2xl font-semibold">Seasons</h1>
      <DataTable
        columns={columns}
        data={seasons}
        className="text-xs md:text-sm"
      />
      <DeleteSeasonModal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        season={selectedSeason}
      />
      <CreateUpdateSeasonModal
        isOpen={isUpdateOpen}
        onClose={closeUpdateModal}
        league={league}
        season={selectedSeason}
        sport={sport}
      />
    </div>
  );
};

export default SeasonsTable;
