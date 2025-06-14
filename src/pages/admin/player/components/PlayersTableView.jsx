import React from "react";
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
  MoreHorizontal 
} from "lucide-react";
import DataTable from "@/components/common/DataTable";
import TablePagination from "@/components/ui/table-pagination";
import { getCourseLabel, getYearLevelLabel } from "@/constants/player";

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
            <AvatarFallback className="rounded-lg bg-accent">{first_name[0]}{last_name[0]}</AvatarFallback>
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
            <DropdownMenuSeparator />            <DropdownMenuItem
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

// Pure table component that receives data and handlers as props
const PlayersTableView = ({ 
  players = [], 
  totalItems = 0,
  totalPages = 1,
  currentPage = 1, 
  pageSize = 10,
  isLoading = false,
  onPageChange,
  onPageSizeChange,
  onUpdatePlayer,
  onDeletePlayer
}) => {
  const navigate = useNavigate();

  const handlePageChange = (newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handleUpdatePlayer = (player) => {
    if (onUpdatePlayer) {
      onUpdatePlayer(player);
    }
  };

  const handleDeletePlayer = (player) => {
    if (onDeletePlayer) {
      onDeletePlayer(player);
    }
  };

  const columns = getColumns(navigate, handleUpdatePlayer, handleDeletePlayer);

  return (
    <div className="space-y-4">      {/* Data table */}
      <DataTable
        columns={columns}
        data={players}
        isLoading={isLoading}
        className="border rounded-lg bg-card"
        showPagination={false} // Disable built-in pagination
        pageSize={pageSize} // Still pass pageSize for row rendering
      />

      {/* Pagination */}
      {totalItems > 0 && (
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          isLoading={isLoading}
          itemName="players"
        />
      )}
    </div>
  );
};

export default PlayersTableView;
