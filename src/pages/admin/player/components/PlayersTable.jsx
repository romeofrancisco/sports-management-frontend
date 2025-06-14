import { useState } from "react";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Trash,
  UserPen,
  UserSearch,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/common/DataTable";
import PageError from "@/pages/PageError";
import DeletePlayerModal from "@/components/modals/DeletePlayerModal";
import PlayerModal from "@/components/modals/PlayerModal";
import { useModal } from "@/hooks/useModal";
import { usePlayers } from "@/hooks/usePlayers";
import { getCourseLabel, getYearLevelLabel } from "@/constants/player";
import PlayersFilterBar from "./PlayersFilterBar";
import { Card } from "@/components/ui/card";

// Custom component for displaying pagination info
const PaginationInfo = ({ currentPage, pageSize, totalItems }) => {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="text-sm text-muted-foreground">
      Showing {start} to {end} of {totalItems} players
    </div>
  );
};

const getColumns = (navigate, handleUpdatePlayer, handleDeletePlayer) => [
  {
    id: "name",
    header: () => <h1 className="ps-3">Name</h1>,
    cell: ({ row }) => {
      const { profile, first_name, last_name } = row.original;
      return (
        <div className="flex gap-2 items-center ps-3">
          <Avatar>
            <AvatarImage src={profile} alt={first_name} />
            <AvatarFallback className="rounded-lg bg-accent">
              {first_name[0]}
              {last_name[0]}
            </AvatarFallback>
          </Avatar>
          <span>
            {first_name} {last_name}
          </span>
        </div>
      );
    },
    size: 200,
  },
  {
    id: "year_level",
    header: "Year Level",
    cell: ({ row }) => getYearLevelLabel(row.original.year_level),
    size: 150,
  },
  {
    id: "course",
    header: "Course",
    cell: ({ row }) => getCourseLabel(row.original.course),
    size: 150,
  },
  {
    id: "sport",
    header: "Sport",
    cell: ({ row }) => row.original.sport.name,
    size: 100,
  },
  {
    id: "position",
    header: "Position",
    cell: ({ row }) =>
      row.original.positions?.map((pos) => pos.abbreviation).join(", "),
    size: 70,
  },
  {
    id: "jersey_number",
    header: "Jersey #",
    cell: ({ row }) => row.original.jersey_number,
    size: 70,
  },
  {
    id: "team",
    header: "Team",
    cell: ({ row }) => row.original.team?.name,
    size: 100,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const player = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />{" "}            <DropdownMenuItem
              onClick={() => navigate(`/players/${player.id}`)}
            >
              <UserSearch />
              View Player
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdatePlayer(player)}>
              <UserPen />
              Update Player
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeletePlayer(player)}>
              <Trash />
              Delete Player
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 40,
  },
];

export const PlayersTable = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState({
    search: "",
    sex: "male",
    sport: "all",
    year_level: "all",
    course: "all",
  });

  const { data, isLoading, isError } = usePlayers(
    filter,
    currentPage,
    pageSize
  );

  const players = data?.results || [];
  const totalPlayers = data?.count || 0;
  const totalPages = Math.ceil(totalPlayers / pageSize);

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

  const navigate = useNavigate();

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleDeletePlayer = (player) => {
    setSelectedPlayer(player);
    openDeleteModal();
  };

  const handleUpdatePlayer = (player) => {
    setSelectedPlayer(player);
    openUpdateModal();
  };

  if (isError) return <PageError />;

  const columns = getColumns(navigate, handleUpdatePlayer, handleDeletePlayer);

  return (
    <Card className="border gap-0 pt-5 md:p-5 lg:p-8 my-5 rounded-lg">
      <PlayersFilterBar
        filter={filter}
        setFilter={(newFilter) => {
          setFilter(newFilter);
          setCurrentPage(1); // Reset to first page when filter changes
        }}
      />
      <DataTable
        columns={columns}
        data={players}
        loading={isLoading}
        className="text-xs md:text-sm"
        showPagination={false} // Disable built-in pagination
        pageSize={pageSize} // Still pass pageSize for row rendering
      />

      {totalPlayers > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <PaginationInfo
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalPlayers}
          />

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                const newSize = Number(value);
                setPageSize(newSize);
                setCurrentPage(1); // Reset to first page when changing page size
              }}
            >
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder="Rows per page" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} per page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isLoading}
                className="h-8 w-8"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show range of pages centered around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className="h-8 w-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage >= totalPages || isLoading}
                className="h-8 w-8"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      <DeletePlayerModal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        player={selectedPlayer}
      />
      <PlayerModal
        isOpen={isUpdateOpen}
        onClose={closeUpdateModal}
        player={selectedPlayer}
      />
    </Card>
  );
};
