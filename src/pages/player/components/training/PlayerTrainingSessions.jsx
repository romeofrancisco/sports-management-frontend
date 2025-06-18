import React, { useState } from "react";
import { Table2, LayoutGrid, Calendar, MapPin, Clock, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrainingSessions } from "@/hooks/useTrainings";
import DataTable from "@/components/common/DataTable";
import TablePagination from "@/components/ui/table-pagination";
import { format } from "date-fns";

const PlayerTrainingSessions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [viewMode, setViewMode] = useState("cards"); // "table" or "cards"
  const [filter, setFilter] = useState({ search: "", team: "", date: "" });
  
  const { data, isLoading, isError } = useTrainingSessions(
    filter,
    currentPage,
    pageSize
  );

  const sessions = data?.results || [];
  const totalSessions = data?.count || 0;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };  // Player-specific table columns (read-only)
  const getPlayerSessionTableColumns = () => [
    {
      accessorKey: "title",
      header: "Session",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.original.title}</span>
          {row.original.description && (
            <span className="text-xs text-muted-foreground line-clamp-1">
              {row.original.description}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date & Time",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {format(new Date(row.original.date), "MMM dd, yyyy")}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.start_time} - {row.original.end_time}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm text-foreground">
            {row.original.location || "TBA"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "attendance_status",
      header: "My Status",
      cell: ({ row }) => {
        const status = row.original.player_attendance_status;
        const getAttendanceVariant = (status) => {
          switch (status?.toLowerCase()) {
            case "present":
              return "default";
            case "late":
              return "secondary";
            case "absent":
              return "destructive";
            case "excused":
              return "outline";
            case "pending":
            default:
              return "outline";
          }
        };

        return (
          <Badge variant={getAttendanceVariant(status)} className="text-xs">
            {status?.toUpperCase() || "PENDING"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Session Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const getStatusVariant = (status) => {
          switch (status?.toLowerCase()) {
            case "completed":
              return "default";
            case "ongoing":
              return "secondary";
            case "upcoming":
              return "outline";
            case "cancelled":
              return "destructive";
            default:
              return "outline";
          }
        };

        return (
          <Badge variant={getStatusVariant(status)} className="text-xs">
            {status?.replace("_", " ").toUpperCase() || "UPCOMING"}
          </Badge>
        );
      },
    },
  ];
  // Training Session Card Component for players (read-only)
  const PlayerTrainingSessionCard = ({ session }) => {
    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case "completed":
          return "bg-green-100 text-green-800 border-green-200";
        case "ongoing":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "upcoming":
          return "bg-gray-100 text-gray-800 border-gray-200";
        case "cancelled":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    const getAttendanceColor = (status) => {
      switch (status?.toLowerCase()) {
        case "present":
          return "bg-green-100 text-green-800 border-green-200";
        case "late":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "absent":
          return "bg-red-100 text-red-800 border-red-200";
        case "excused":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "pending":
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-foreground mb-1">
                {session.title}
              </CardTitle>
              {session.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {session.description}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1 ml-2">
              <Badge 
                className={`text-xs ${getStatusColor(session.status)}`}
                variant="outline"
              >
                {session.status?.replace("_", " ").toUpperCase() || "UPCOMING"}
              </Badge>
              <Badge 
                className={`text-xs ${getAttendanceColor(session.player_attendance_status)}`}
                variant="outline"
              >
                {session.player_attendance_status?.toUpperCase() || "PENDING"}
              </Badge>
            </div>
          </div>
        </CardHeader>        <CardContent className="space-y-4">
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">
              {format(new Date(session.date), "EEEE, MMMM dd, yyyy")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-foreground">
              {session.start_time} - {session.end_time}
            </span>
          </div>

          {/* My Attendance Status */}
          <div className="flex items-center gap-2 text-sm">
            <UserCheck className="h-4 w-4 text-primary" />
            <span className="text-foreground font-medium">My Status:</span>
            <Badge 
              className={`text-xs ${getAttendanceColor(session.player_attendance_status)}`}
              variant="outline"
            >
              {session.player_attendance_status?.toUpperCase() || "PENDING"}
            </Badge>
          </div>

          {/* Location */}
          {session.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-foreground">{session.location}</span>
            </div>
          )}

          {/* Session Type */}
          {session.session_type && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {session.session_type}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Training Sessions</h2>
          <p className="text-muted-foreground">View your scheduled training sessions</p>
        </div>
        <div className="text-center py-12">
          <div className="text-red-500">Error loading training sessions.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Training Sessions</h2>
        <p className="text-muted-foreground">View your scheduled training sessions</p>
      </div>

      {/* View Toggle and Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-primary/10 rounded-full flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {totalSessions} session{totalSessions !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="flex items-center gap-2"
          >
            <Table2 className="h-4 w-4" />
            Table
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="flex items-center gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Cards
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "table" ? (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <DataTable
              columns={getPlayerSessionTableColumns()}
              data={sessions}
              loading={isLoading}
              className="text-xs sm:text-sm"
              showPagination={false}
              pageSize={pageSize}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.length === 0 && !isLoading ? (
            <div className="text-center py-16">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-primary/20">
                <Calendar className="h-10 w-10 text-primary" />
              </div>
              <p className="text-foreground font-bold text-lg mb-2">
                No training sessions found
              </p>
              <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                {filter.search || filter.team || filter.date
                  ? "Try adjusting your filters to find sessions"
                  : "No training sessions have been scheduled yet"}
              </p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-16">
              <div className="text-muted-foreground">Loading sessions...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sessions.map((session, index) => (
                <div
                  key={session.id}
                  className="animate-in fade-in-50 duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PlayerTrainingSessionCard session={session} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalSessions > 0 && (
        <div className="border-t pt-4">
          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalSessions}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoading}
            itemName="sessions"
            pageSizeOptions={[12, 24, 36, 48]}
          />
        </div>
      )}
    </div>
  );
};

export default PlayerTrainingSessions;
