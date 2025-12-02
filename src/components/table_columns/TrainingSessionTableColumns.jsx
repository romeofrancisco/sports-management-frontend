import {
  Edit,
  MoreHorizontal,
  Trash,
  Settings,
  Calendar,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatTo12HourTime } from "@/utils/formatTime";
import { formatShortDate } from "@/utils/formatDate";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const getStatusConfig = (status) => {
  switch (status) {
    case "upcoming":
      return {
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
        text: "Upcoming",
      };
    case "ongoing":
      return {
        className:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
        text: "Ongoing",
      };
    case "completed":
      return {
        className:
          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
        text: "Completed",
      };
    case "cancelled":
      return {
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
        text: "Cancelled",
      };
    default:
      return {
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
        text: "Upcoming",
      };
  }
};

const getTrainingSessionTableColumns = ({ onEdit, onDelete, onManage }) => [
  {
    header: () => <h1 className="ps-3">Session</h1>,
    accessorKey: "title",
    size: 260,
    cell: ({ row }) => {
      const session = row.original;
      const status = session.status || "upcoming";
      const config = getStatusConfig(status);
      const team_logo = session.team_logo;

      return (
        <div className="flex items-center gap-2 sm:ps-3 max-w-[180px] sm:max-w-full">
          <Avatar className="size-8 border-primary/20 border-2">
            <AvatarImage src={team_logo} alt={session.team_name} />
            <AvatarFallback className="rounded-lg bg-accent font-bold">
              {session.team_name ? session.team_name[0] : "S"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium truncate max-w-[100px] sm:max-w-full">{session.title}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge
                variant="secondary"
                className={`h-4 px-1.5 text-[10px] ${config.className}`}
              >
                {config.text}
              </Badge>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    header: "Schedule",
    accessorKey: "date",
    size: 180,
    cell: ({ row }) => {
      const session = row.original;
      const start = session.start_time;
      const end = session.end_time;

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary/80" />
            <span className="text-sm font-medium">
              {formatShortDate(session.date)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatTo12HourTime(start)} - {formatTo12HourTime(end)}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    header: "Team & Venue",
    accessorKey: "team_name",
    size: 200,
    cell: ({ row }) => {
      const session = row.original;

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary/80" />
            <span className="text-sm font-medium">
              {session.team_name || "—"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground truncate max-w-[150px]">
              {session.location || "No venue"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    size: 40,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onManage(row.original)}>
            <Settings />
            Manage Session
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            <Edit />
            Update Session
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(row.original)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <Trash />
            Delete Session
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default getTrainingSessionTableColumns;
