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
import { Trash, UserPen, UserSearch, MoreHorizontal } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import TablePagination from "@/components/ui/table-pagination";
import { getCourseLabel, getYearLevelLabel } from "@/constants/player";

const getColumns = (navigate, handleUpdatePlayer, handleDeletePlayer) => [
  {
    id: "player",
    header: () => <h1 className="ps-3">Player</h1>,
    cell: ({ row }) => {
      const { profile, first_name, last_name, jersey_number, email } =
        row.original;
      return (
        <div className="flex gap-3 items-center ps-3">
          <div className="relative">
            <Avatar className="size-10 border-primary/20 border-2">
              <AvatarImage src={profile} alt={first_name} />
              <AvatarFallback className="rounded-lg bg-accent">
                {first_name?.[0]}
                {last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            {jersey_number && (
              <span className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full size-6 flex items-center justify-center border-2 border-background">
                #{jersey_number}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">
              {first_name} {last_name}
            </span>
            <span className="text-muted-foreground text-xs">{email}</span>
          </div>
        </div>
      );
    },
    size: 220,
  },
  {
    id: "academic_info",
    header: "Academic Info",
    cell: ({ row }) => {
      const { academic_info } = row.original;
      if (!academic_info) {
        return <span className="text-muted-foreground text-sm">—</span>;
      }
      const section = academic_info?.section
        ? ` - ${academic_info.section}`
        : "";
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-sm">
            {academic_info?.year_level}
          </span>
          <span className="text-muted-foreground text-xs">
            {academic_info?.course}
            {section}
          </span>
        </div>
      );
    },
    size: 160,
  },
  {
    id: "sport_position",
    header: "Sport & Position",
    cell: ({ row }) => {
      const { sport, positions } = row.original;
      const positionText = positions?.map((pos) => pos.abbreviation).join(", ");
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-sm">{sport?.name || "—"}</span>
          {positionText && (
            <span className="text-muted-foreground text-xs">
              {positionText}
            </span>
          )}
        </div>
      );
    },
    size: 140,
  },
  {
    id: "team",
    header: "Team",
    cell: ({ row }) => {
      const {logo, name, head_coach_info} = row.original.team;
      if (!row.original.team) {
        return (
          <span className="text-muted-foreground text-sm">Unassigned</span>
        );
      }
      return (
        <div className="flex gap-3 items-center ps-3">
          <div className="relative">
            <Avatar className="size-10 border-primary/20 border-2">
              <AvatarImage src={logo} alt={name} />
              <AvatarFallback className="rounded-lg bg-accent">
                {name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">
              {name}
            </span>
            <span className="text-muted-foreground text-xs">{head_coach_info?.full_name}</span>
            <span className="text-muted-foreground/80 text-xs">{head_coach_info?.email}</span>
          </div>
        </div>
      );
    },
    size: 120,
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
            <DropdownMenuSeparator />{" "}
            <DropdownMenuItem onClick={() => navigate(`/players/${player.id}`)}>
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
  onDeletePlayer,
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
  console.log("players table view", players);

  return (
    <div className="space-y-4">
      {" "}
      {/* Data table */}
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
