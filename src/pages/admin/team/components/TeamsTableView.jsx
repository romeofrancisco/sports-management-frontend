import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Users,
  Trophy,
  Mars,
  Venus,
  RotateCcw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DataTable from "@/components/common/DataTable";
import TablePagination from "@/components/ui/table-pagination";
import { getDivisionLabel } from "@/constants/team";

const ActionsCell = ({
  team,
  navigate,
  onUpdateTeam,
  onDeleteTeam,
  onReactivateTeam,
}) => {
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
        <DropdownMenuItem
          onClick={() => {
            navigate(`/teams/${team.slug}`);
            setOpen(false);
          }}
        >
          <Eye />
          View Team
        </DropdownMenuItem>
        {team.is_active && (
          <DropdownMenuItem
            onClick={() => {
              onUpdateTeam(team);
              setOpen(false);
            }}
          >
            <Edit />
            Edit Team
          </DropdownMenuItem>
        )}
        {team.is_active ? (
          <DropdownMenuItem
            onClick={() => {
              onDeleteTeam(team);
              setOpen(false);
            }}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <Trash2 />
            Delete Team
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => {
              onReactivateTeam(team);
              setOpen(false);
            }}
            className="text-green-600 focus:text-green-600 focus:bg-green-600/10"
          >
            <RotateCcw />
            Reactivate Team
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const getColumns = (navigate, onUpdateTeam, onDeleteTeam, onReactivateTeam) => [
  {
    id: "team",
    header: () => <h1 className="ps-3">Team</h1>,
    cell: ({ row }) => {
      const team = row.original;
      const hasHeadCoach = team.head_coach_name || team.head_coach?.full_name;
      const hasAssistantCoach =
        team.assistant_coach_name || team.assistant_coach?.full_name;
      const hasAnyCoach = hasHeadCoach || hasAssistantCoach;

      return (
        <div className="flex gap-3 items-center ps-3">
          <div className="relative">
            <Avatar className="size-10 border-primary/20 border-2">
              <AvatarImage src={team.logo} alt={team.name} />
              <AvatarFallback className="rounded-lg bg-accent font-bold">
                {team.name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{team.name}</span>
            <p className="text-xs text-muted-foreground">
              {team.abbreviation && team.abbreviation} -{" "}
              <span className="font-medium">
                {getDivisionLabel(team.division)}
              </span>
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge
                variant={team.is_active ? "default" : "destructive"}
                className={`h-4 px-1.5 text-[10px] ${
                  team.is_active
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {team.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      );
    },
    size: 260,
  },
  {
    id: "sport_stats",
    header: "Sport",
    cell: ({ row }) => {
      const team = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-primary/80" />
            <span className="text-sm font-medium">
              {team.sport?.name || team.sport_name || "—"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {team.player_count || team.players_count || 0} players
            </span>
          </div>
        </div>
      );
    },
    size: 150,
  },
  {
    id: "coaches",
    header: "Coaches",
    cell: ({ row }) => {
      const { first_name, last_name, full_name, email, profile, sex } =
        row.original.head_coach_info;

      if (!row.original.head_coach_info) {
        return (
          <span className="text-muted-foreground text-sm">
            No coach assigned
          </span>
        );
      }

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Avatar className="size-8 border-primary/20 border-2">
              <AvatarImage src={profile} alt={full_name} />
              <AvatarFallback className="rounded-lg bg-accent font-bold">
                {full_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium flex items-center">
                {sex === "male" && (
                  <Mars className="inline-block h-4 w-4 mr-1 text-blue-500" />
                )}
                {sex === "female" && (
                  <Venus className="inline-block h-4 w-4 mr-1 text-pink-500" />
                )}
                {full_name}
              </span>
              <span className="text-xs text-muted-foreground">{email}</span>
            </div>
          </div>
        </div>
      );
    },
    size: 180,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const team = row.original;
      return (
        <ActionsCell
          team={team}
          navigate={navigate}
          onUpdateTeam={onUpdateTeam}
          onDeleteTeam={onDeleteTeam}
          onReactivateTeam={onReactivateTeam}
        />
      );
    },
    size: 40,
  },
];

const TeamsTableView = ({
  teams,
  totalItems,
  totalPages,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
  onPageSizeChange,
  onUpdateTeam,
  onDeleteTeam,
  onReactivateTeam,
}) => {
  const navigate = useNavigate();

  const columns = getColumns(
    navigate,
    onUpdateTeam,
    onDeleteTeam,
    onReactivateTeam
  );

  return (
    <div className="space-y-4">
      {console.log(teams)}
      <DataTable
        columns={columns}
        data={teams}
        isLoading={isLoading}
        className="border rounded-lg bg-card"
        showPagination={false}
        pageSize={pageSize}
      />

      {totalItems > 0 && (
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          isLoading={isLoading}
          itemName="teams"
        />
      )}
    </div>
  );
};

export default TeamsTableView;
