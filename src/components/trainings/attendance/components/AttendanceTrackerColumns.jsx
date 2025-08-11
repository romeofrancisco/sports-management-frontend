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

export const getPlayerAttendanceColumns = (attendanceData) => {
  // When team is selected, attendanceData will be an array with one team containing players
  const teamData = attendanceData?.[0];
  const players = teamData?.players || [];
  
  if (players.length === 0) {
    return [];
  }

  // Get all unique date keys from the first player's attendance
  const firstPlayer = players[0];
  const dateKeys = firstPlayer ? Object.keys(firstPlayer.attendance) : [];

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100";
      case "late":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100";
      case "absent":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100";
      case "excused":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100";
      case "not_enrolled":
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
    }
  };

  const getCellBgColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 dark:bg-green-900";
      case "late":
        return "bg-yellow-100 dark:bg-yellow-900";
      case "absent":
        return "bg-red-100 dark:bg-red-900";
      case "excused":
        return "bg-blue-100 dark:bg-blue-900";
      case "not_enrolled":
        return "bg-gray-100 dark:bg-gray-800";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "present":
        return "Present";
      case "late":
        return "Late";
      case "absent":
        return "Absent";
      case "excused":
        return "Excused";
      case "not_enrolled":
        return "-";
      default:
        return "-";
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Player Name",
      cell: ({ row }) => {
        const playerName = row.getValue("name");
        const playerProfile = row.original.profile;
        const jerseyNumber = row.original.jersey_number;
        return (
          <span className="flex items-center gap-2 font-semibold">
            <Avatar className="w-8 h-8">
              <AvatarImage src={playerProfile} alt={playerName} />
              <AvatarFallback className="text-xs font-semibold">
                {jerseyNumber ? `#${jerseyNumber}` : playerName?.split(' ').map(n => n[0]).join('').substring(0, 2) || '??'}
              </AvatarFallback>
            </Avatar>
            {playerName}
          </span>
        );
      },
    },
    ...dateKeys.map((date) => ({
      id: date,
      accessorKey: date,
      header: formatShortDate(date),
      meta: {
        className: (cellContext) => {
          const entry = cellContext.row.original.attendance[date];
          if (entry && entry.has_session) {
            const bgColor = getCellBgColor(entry.status);
            return `${bgColor} p-0`;
          }
          return "p-0";
        },
      },
      cell: ({ row }) => {
        const entry = row.original.attendance[date];
        if (!entry || !entry.has_session) {
          // No session on this date
          return (
            <span
              className="w-full h-full block"
              style={{ display: "block", minHeight: 24, minWidth: 24 }}
            >
              {/* No session */}
            </span>
          );
        }

        const status = entry.status;
        const bgColor = getCellBgColor(status);
        const statusDisplay = getStatusDisplay(status);

        return (
          <div
            className={`absolute inset-0 w-full h-full min-h-16 min-w-1 flex items-center justify-center ${bgColor}`}
          >
            <span className="text-xs font-medium">
              {statusDisplay}
            </span>
          </div>
        );
      },
    })),
  ];

  return columns;
};
