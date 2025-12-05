import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Trash2, FileText } from "lucide-react";
import ControlledMultiSelect from "@/components/common/ControlledMultiSelect";

/**
 * Get status badge component
 */
export const getStatusBadge = (status) => {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-800 border-0 dark:bg-green-900/30 dark:text-green-400">
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-800 border-0 dark:bg-red-900/30 dark:text-red-400">
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-0 dark:bg-yellow-900/30 dark:text-yellow-400">
          Pending
        </Badge>
      );
  }
};

/**
 * Create columns for the registration approval table
 */
export const createRegistrationColumns = ({
  onApprove,
  onReject,
  onViewDetails,
  onDelete,
  isAdmin,
}) => {
  const columns = [
    {
      header: "Applicant",
      accessorFn: (row) => row,
      cell: ({ getValue }) => {
        const row = getValue();
        const fullName = row.full_name || `${row.first_name} ${row.last_name}`;
        const initials = `${row.first_name?.[0] || ""}${
          row.last_name?.[0] || ""
        }`.toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-10 hidden md:inline-flex">
              <AvatarImage src={row.profile} alt={fullName} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-medium truncate">{fullName}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[100px] md:max-w-[150px] lg:max-w-full">
                {row.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Sport",
      accessorFn: (row) => row,
      cell: ({ getValue }) => {
        const { sport, positions } = getValue();
        return (
          <div className="flex flex-col">
            <span className="font-medium">{sport?.name || "-"}</span>
            {positions?.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {positions.map((p) => p.name).join(", ")}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Academic Info",
      accessorFn: (row) => row.academic_info,
      cell: ({ getValue }) => {
        const academicInfo = getValue();
        if (!academicInfo)
          return <span className="text-muted-foreground">-</span>;

        return (
          <div className="flex flex-col">
            <span>{academicInfo.year_level}</span>
            <span className="text-xs text-muted-foreground">
              {academicInfo.course}
              {academicInfo.section && ` - ${academicInfo.section}`}
            </span>
          </div>
        );
      },
    },
    {
      header: "Documents",
      accessorFn: (row) => row.documents_count,
      cell: ({ getValue }) => {
        const count = getValue();
        return (
          <div className="flex items-center gap-1">
            <FileText className="size-4 text-muted-foreground" />
            <span>{count || 0}</span>
          </div>
        );
      },
    },
    {
      header: "Submitted",
      accessorFn: (row) => row.created_at,
      cell: ({ getValue }) => {
        const date = getValue();
        if (!date) return "-";
        try {
          return (
            <div className="flex flex-col">
              <span>{format(new Date(date), "PP")}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(date), "p")}
              </span>
            </div>
          );
        } catch {
          return "-";
        }
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => {
        const row = info.row.original;
        const isPending = row.status === "pending";
        return (
          <div className="space-x-2">
            {isPending ? (
              <>
                <Button
                  size="sm"
                  onClick={() => onApprove(row)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onReject(row)}
                >
                  Reject
                </Button>
              </>
            ) : (
              getStatusBadge(row.status)
            )}
          </div>
        );
      },
    },
  ];

  // Add actions column for admin/coach
  if (isAdmin) {
    columns.push({
      header: "",
      accessorKey: "id_action",
      cell: (info) => {
        const row = info.row.original;

        return (
          <div className="flex items-center gap-2 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onViewDetails(row)}>
                  <Eye className="size-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(row)}
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    });
  } else {
    columns.push({
      header: "",
      accessorKey: "id_action",
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex w-full justify-end">
            <Button
            size="sm"
              className=""
              variant="outline"
              onClick={() => onViewDetails(row)}
            >
              View Details
            </Button>
          </div>
        );
      },
    });
  }

  return columns;
};
