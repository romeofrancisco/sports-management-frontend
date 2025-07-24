import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { formatShortDate } from "@/utils/formatDate";

export const getAllTeamsAttendanceColumns = (attendanceData) => {
  // Get all unique date keys (from the first team or merge all teams if needed)
  const firstTeam = attendanceData?.[0];
  const dateKeys = firstTeam ? Object.keys(firstTeam.attendance) : [];

  const columns = [
    {
      accessorKey: "team",
      header: "Team Name",
      cell: ({ row }) => {
        const logo = row.original.logo;
        const teamName = row.getValue("team");
        return (
          <span className="flex items-center gap-2 font-semibold">
            <Avatar className="w-6 h-6">
              <AvatarImage src={logo} alt={teamName} />
              <AvatarFallback>{teamName?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            {teamName}
          </span>
        );
      },
    },
    ...dateKeys.map((date) => ({
      id: date,
      accessorKey: date,
      header: formatShortDate(date),
      meta: {
        // This will be used as the TableCell className
        getBg: (row) => {
          const entry = row.original.attendance[date];
          if (!entry || !entry.has_session) return "";
          if (entry.percentage >= 100) return "bg-green-100 dark:bg-green-900";
          if (entry.percentage >= 75) return "bg-yellow-100 dark:bg-yellow-900";
          return "bg-red-100 dark:bg-red-900";
        },
      },
      cell: ({ row }) => {
        const entry = row.original.attendance[date];
        if (!entry || !entry.has_session) {
          // Return an empty span so the cell still gets the background color
          return (
            <span
              className="w-full h-full block"
              style={{ display: "block", minHeight: 24, minWidth: 24 }}
            >
              {/* No session */}
            </span>
          );
        }
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className="w-full h-full block"
                style={{ display: "block", minHeight: 24, minWidth: 24 }}
              >
                {entry.present} ({entry.percentage}%)
              </span>
            </TooltipTrigger>
            <TooltipContent>
              Present: {entry.present} ({entry.percentage}%)
            </TooltipContent>
          </Tooltip>
        );
      },
    })),
  ];

  // Patch columns to inject the background color class into TableCell
  return columns.map((col) => {
    if (col.meta && col.meta.getBg) {
      return {
        ...col,
        meta: {
          ...col.meta,
          className: (cellContext) => {
            const entry = cellContext.row.original.attendance[col.accessorKey];
            if (entry && entry.has_session) {
              if (entry.percentage >= 100)
                return "bg-green-100 dark:bg-green-900 p-0";
              if (entry.percentage >= 75)
                return "bg-yellow-100 dark:bg-yellow-900 p-0";
              return "bg-red-100 dark:bg-red-900 p-0";
            }
            return "p-0";
          },
        },
        cell: (cellContext) => {
          const entry = cellContext.row.original.attendance[col.accessorKey];
          let bgColor = "";
          if (entry && entry.has_session) {
            if (entry.percentage >= 100)
              bgColor = "bg-green-100 dark:bg-green-900";
            else if (entry.percentage >= 75)
              bgColor = "bg-yellow-100 dark:bg-yellow-900";
            else bgColor = "bg-red-100 dark:bg-red-900";
          }
          // Compose the cell content
          if (!entry || !entry.has_session) {
            return (
              <span
                className={`w-full h-full ${bgColor}`}
                style={{ display: "block", minHeight: 24, minWidth: 24 }}
              />
            );
          }
          return (
            <Tooltip>
              <TooltipTrigger className="size-full">
                <div
                  className={`absolute inset-0 w-full h-full min-h-16 min-w-1 ${bgColor}`}
                />
              </TooltipTrigger>
              <TooltipContent>
                {`Present: ${entry.present} (${entry.percentage}%)`}
              </TooltipContent>
            </Tooltip>
          );
        },
      };
    }
    return col;
  });
};
