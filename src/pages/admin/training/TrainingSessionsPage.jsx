import React, { useState } from "react";
import {
  useTrainingSessions,
  useDeleteTrainingSession,
} from "@/hooks/useTrainings";
import { useTeams } from "@/hooks/useTeams";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Loader2,
  CalendarDays,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import TrainingSessionFormDialog from "@/components/modals/trainings/TrainingSessionFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

const TrainingSessionsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    team: "all_teams", // Change from empty string to 'all_teams'
    training_type: "",
    // Add the query parameter in case our hook mapping expects it
    query: "",
  });
  const { sessions, isLoading, totalCount, pagination } =
    useTrainingSessions(filters);
  const { deleteSession, isLoading: isDeleting } = useDeleteTrainingSession();
  const { teams, isLoading: isLoadingTeams } = useTeams({});

  const handleOpenModal = (session = null) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const handleDeleteClick = (session) => {
    setSessionToDelete(session);
  };

  const handleConfirmDelete = () => {
    if (!sessionToDelete) return;

    deleteSession(sessionToDelete.session_id, {
      onSuccess: () => {
        toast({
          title: "Training Session Deleted",
          description: `"${sessionToDelete.title}" has been removed.`,
        });
        setSessionToDelete(null);
      },
      onError: (error) => {
        toast({
          title: "Delete Failed",
          description: `Failed to delete session: ${error.message}`,
          variant: "destructive",
        });
      },
    });
  };
  const handleFilterChange = (key, value) => {
    // Handle special filter values that need conversion to empty strings for the API
    if (
      value === "all_types" ||
      value === "all_teams" ||
      value === "all_players" ||
      value === "all_metrics"
    ) {
      setFilters((prev) => ({ ...prev, [key]: "" }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  const formatTimeRange = (startTime, endTime) => {
    try {
      return `${startTime} - ${endTime}`;
    } catch (e) {
      return `${startTime} - ${endTime}`;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Training Sessions</h2>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Schedule Session</span>
        </Button>
      </div>      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search sessions..."
          value={filters.search}
          onChange={(e) => {
            // Update both search and query fields to ensure compatibility
            setFilters((prev) => ({
              ...prev,
              search: e.target.value,
              query: e.target.value,
            }));
          }}
          className="md:max-w-xs"
        />
        <Select
          value={filters.training_type}
          onValueChange={(value) => handleFilterChange("training_type", value)}
        >
          <SelectTrigger className="md:max-w-xs">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_types">All Types</SelectItem>
            <SelectItem value="team">Team Training</SelectItem>
            <SelectItem value="individual">Individual Training</SelectItem>
          </SelectContent>
        </Select>
          <Select
          value={filters.team}
          onValueChange={(value) => handleFilterChange("team", value)}
        >
          <SelectTrigger className="md:max-w-xs">
            <SelectValue placeholder="Filter by team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_teams">All Teams</SelectItem>
            {!isLoadingTeams && teams?.map(team => (
              <SelectItem key={team.id} value={team.id.toString()}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <Card key={session.session_id} className="overflow-hidden">
                  <div className="flex items-center justify-between p-6 pb-2">
                    <div>
                      <Badge
                        variant={
                          session.training_type === "team"
                            ? "default"
                            : "outline"
                        }
                      >
                        {session.training_type === "team"
                          ? "Team Training"
                          : "Individual Training"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handleOpenModal(session)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeleteClick(session)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CardHeader className="pt-2">
                    <CardTitle className="text-lg">
                      <Link
                        to={`/admin/training/sessions/${session.session_id}`}
                        className="hover:underline"
                      >
                        {session.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{formatDate(session.date)}</span>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {formatTimeRange(session.start_time, session.end_time)}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{session.location}</span>
                    </div>

                    {session.team_name && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{session.team_name}</span>
                      </div>
                    )}

                    {session.categories?.length > 0 && (
                      <div className="pt-2">
                        <div className="text-sm font-medium mb-2">
                          Categories:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {session.categories.map((category) => (
                            <Badge
                              key={category.id}
                              style={{ backgroundColor: '#007bff' }}
                              className="text-xs"
                            >
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Coach: {session.coach_name || "Unassigned"}
                    </div>
                    <Link
                      to={`/admin/training/sessions/${session.session_id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      View Details
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  No training sessions found.
                  {filters.search || filters.training_type
                    ? " Try adjusting your filters."
                    : ""}
                </p>
              </div>
            )}
          </div>

          {sessions.length > 0 && totalCount > sessions.length && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => pagination.onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => pagination.onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <TrainingSessionFormDialog
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        session={selectedSession}
        onSuccess={handleCloseModal}
      />

      <AlertDialog
        open={!!sessionToDelete}
        onOpenChange={() => setSessionToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Training Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the training session "
              {sessionToDelete?.title}" on {sessionToDelete?.date} and all
              associated player records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TrainingSessionsPage;
