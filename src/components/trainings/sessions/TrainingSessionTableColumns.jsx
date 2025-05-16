import { Edit, MoreHorizontal, Trash, ClipboardCheck } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatTo12HourTime } from "@/utils/formatTime";


const getTrainingSessionTableColumns = ({ onEdit, onDelete, onAttendance }) => [
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
  {
    header: "Team",
    accessorKey: "team_name",
  },
  {
    header: "Venue",
    accessorKey: "location",
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
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onAttendance(row.original)}>
                <ClipboardCheck />
                Record Attendance
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            <Edit />
            Update Session
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(row.original)}>
            <Trash />
            Delete Session
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default getTrainingSessionTableColumns;
