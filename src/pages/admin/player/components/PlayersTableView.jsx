import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Trash,
  UserPen,
  UserSearch,
  MoreHorizontal,
  Mars,
  Venus,
  RotateCcw,
} from "lucide-react";
import DataTable from "@/components/common/DataTable";
import TablePagination from "@/components/ui/table-pagination";

const ActionsCell = ({ player, navigate, handleUpdatePlayer, handleDeletePlayer, onReactivatePlayer }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => { navigate(`/players/${player.id}`); setOpen(false); }}>
          <UserSearch />
          View Player
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { handleUpdatePlayer(player); setOpen(false); }}>
          <UserPen />
          Update Player
        </DropdownMenuItem>
        {player?.is_active ? (
          <DropdownMenuItem
            onClick={() => { handleDeletePlayer && handleDeletePlayer(player); setOpen(false); }}
            className="text-destructive focus:text-destructive focus:bg-destructive/10 hover:text-destructive hover:bg-destructive/10"
          >
            <Trash />
            Delete Player
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => { onReactivatePlayer && onReactivatePlayer(player); setOpen(false); }}
            className="text-green-600 focus:text-green-600 focus:bg-green-600/10 hover:text-green-600 hover:bg-green-600/10"
          >
            <RotateCcw />
            Reactivate Player
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const getColumns = (
  navigate,
  handleUpdatePlayer,
  handleDeletePlayer,
  onReactivatePlayer
) => [
  {
    id: "player",
    header: () => <h1 className="ps-3">Player</h1>,
    cell: ({ row }) => {
      const {
        profile,
        first_name,
        last_name,
        jersey_number,
        email,
        sex,
        is_active,
      } = row.original;
      return (
        <div className="flex gap-3 items-center sm:ps-3 max-w-[180px] sm:max-w-full">
          <div className="relative hidden sm:block">
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
          <div className="flex flex-col gap-0.5">
            <span className="font-medium flex items-center gap-0.5">
              {sex === "male" && <Mars className="size-4 text-blue-500" />}
              {sex === "female" && <Venus className="size-4 text-pink-500" />}
              {first_name} {last_name}
            </span>
            <span className="text-muted-foreground text-xs truncate max-w-[120px] sm:max-w-full">
              {email}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge
                variant={is_active ? "default" : "destructive"}
                className={`h-4 px-1.5 text-[10px] ${
                  is_active
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      );
    },
    size: 260,
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
      const { logo, name, head_coach_info } = row.original.team;
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
            <span className="font-medium">{name}</span>
            <span className="text-muted-foreground text-xs">
              {head_coach_info?.full_name}
            </span>
            <span className="text-muted-foreground/80 text-xs">
              {head_coach_info?.email}
            </span>
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
        <ActionsCell
          player={player}
          navigate={navigate}
          handleUpdatePlayer={handleUpdatePlayer}
          handleDeletePlayer={handleDeletePlayer}
          onReactivatePlayer={onReactivatePlayer}
        />
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
  onReactivatePlayer,
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

  const columns = getColumns(navigate, handleUpdatePlayer, handleDeletePlayer, onReactivatePlayer);

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
      <div className="px-6">
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          isLoading={isLoading}
          itemName="players"
        />
      </div>
    </div>
  );
};

export default PlayersTableView;
