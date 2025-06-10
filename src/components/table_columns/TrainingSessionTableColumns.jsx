import {
  Edit,
  MoreHorizontal,
  Trash,
  Settings,
  PlayCircle,
  StopCircle,
} from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatTo12HourTime } from "@/utils/formatTime";

const getTrainingSessionTableColumns = ({
  onEdit,
  onDelete,
  onManage,
}) => [
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
  },
  {
    header: "Time",
    accessorKey: "time",
    cell: ({ row }) => {
      const start = row.original.start_time;
      const end = row.original.end_time;
      return `${formatTo12HourTime(start)} - ${formatTo12HourTime(end)}`;
    },
  },
  // {
  //   header: "Coach",
  //   accessorKey: "coach_name",
  // },
  {
    header: "Team",
    accessorKey: "team_name",
  },  {
    header: "Venue",
    accessorKey: "location",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue, row }) => {
      const status = getValue() || 'upcoming'; // Default to upcoming if no status
      const getStatusConfig = (status) => {
        switch(status) {
          case 'upcoming':
            return { variant: 'secondary', className: 'bg-blue-100 text-blue-700 hover:bg-blue-200', text: 'Upcoming' };
          case 'ongoing':
            return { variant: 'secondary', className: 'bg-green-100 text-green-700 hover:bg-green-200', text: 'Ongoing' };
          case 'completed':
            return { variant: 'secondary', className: 'bg-gray-100 text-gray-700 hover:bg-gray-200', text: 'Completed' };
          default:
            return { variant: 'secondary', className: 'bg-blue-100 text-blue-700 hover:bg-blue-200', text: 'Upcoming' };
        }
      };
      const config = getStatusConfig(status);
      return (
        <Badge variant={config.variant} className={config.className}>
          {config.text}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>{" "}        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onManage(row.original)}>
            <Settings className="h-4 w-4 mr-2" />
            Manage Session
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            <Edit className="h-4 w-4 mr-2" />
            Update Session
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(row.original)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete Session
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default getTrainingSessionTableColumns;
