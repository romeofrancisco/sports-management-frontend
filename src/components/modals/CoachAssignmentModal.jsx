import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Users,
  UserPlus,
  UserMinus,
  Mail,
  Shield,
  Calendar,
} from "lucide-react";
import Loading from "@/components/common/FullLoading";
import {
  useAvailableCoaches,
  useGameCoachAssignments,
  useAssignCoachToGame,
  useRemoveCoachFromGame,
} from "@/hooks/useGames";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatShortDate } from "@/utils/formatDate";

const CoachAssignmentModal = ({ isOpen, onClose, game }) => {
  const [isAssigning, setIsAssigning] = useState(false);

  const { data: availableCoaches, isLoading: isCoachesLoading } =
    useAvailableCoaches(isOpen);
  const { data: assignments, isLoading: isAssignmentsLoading } =
    useGameCoachAssignments(game?.id, isOpen);

  const assignCoachMutation = useAssignCoachToGame();
  const removeCoachMutation = useRemoveCoachFromGame();

  const isLoading = isCoachesLoading || isAssignmentsLoading;

  const assignedCoachIds = new Set(
    assignments?.map((assignment) => assignment.coach) || []
  );
  const unassignedCoaches =
    availableCoaches?.filter((coach) => !assignedCoachIds.has(coach.id)) || [];

  const handleAssignCoach = async (coachId) => {
    setIsAssigning(true);
    try {
      await assignCoachMutation.mutateAsync({ gameId: game.id, coachId });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveCoach = async (coachId) => {
    try {
      await removeCoachMutation.mutateAsync({ gameId: game.id, coachId });
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  if (isLoading) return <Loading />;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Coach Assignment Management
          </DialogTitle>
          <DialogDescription>
            Manage coach assignments for{" "}
            <span className="font-semibold text-primary">
              {game?.home_team?.name} vs {game?.away_team?.name}
            </span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          {/* Assigned Coaches Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">Assigned Coaches</h3>
              <Badge variant="secondary">{assignments?.length || 0}</Badge>
            </div>

            {assignments && assignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignments.map((assignment) => (
                  <Card key={assignment.id} className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-3 ">
                        <div className="flex items-start gap-3 flex-1">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={assignment.profile}
                              alt={assignment.coach_name}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {assignment.coach_name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "C"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">
                                {assignment.coach_name}
                              </h4>
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                Assigned
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                              <Mail className="w-3 h-3" />
                              {assignment.coach_email}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              Assigned by {assignment.assigned_by_name} on{" "}
                              {formatShortDate(assignment.assigned_at)}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveCoach(assignment.coach)}
                          disabled={removeCoachMutation.isLoading}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <UserMinus className="w-4 h-4" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No coaches assigned yet</p>
                <p className="text-sm">
                  Start by assigning coaches from the available list
                </p>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Available Coaches Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <UserPlus className="w-4 h-4 text-secondary-foreground" />
              <h3 className="font-semibold">Available Coaches</h3>
              <Badge variant="outline">{unassignedCoaches.length}</Badge>
            </div>

            {unassignedCoaches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unassignedCoaches.map((coach) => (
                  <Card key={coach.id} className="border-secondary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={coach.profile} alt={coach.name} />
                            <AvatarFallback className="bg-secondary/10 text-secondary-foreground">
                              {coach.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "C"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{coach.name}</h4>
                              <Badge variant="secondary" className="text-xs">
                                Available
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                              <Mail className="w-3 h-3" />
                              {coach.email}
                            </div>
                            {coach.teams && coach.teams.length > 0 ? (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Users className="w-3 h-3" />
                                <div className="flex -space-x-1">
                                  {coach.teams
                                    .slice(0, 4)
                                    .map((team, index) => (
                                      <div key={index} className="relative">
                                        {team.logo ? (
                                          <img
                                            src={team.logo}
                                            alt={team.name}
                                            className="w-6 h-6 rounded-full border-2 border-background object-cover"
                                            title={team.name}
                                          />
                                        ) : (
                                          <div
                                            className="w-6 h-6 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center"
                                            title={team.name}
                                          >
                                            <span className="text-xs font-medium text-primary">
                                              {team.name.charAt(0)}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  {coach.teams.length > 3 && (
                                    <div className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                                      <span className="text-xs text-muted-foreground">
                                        +{coach.teams.length - 3}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Users className="w-3 h-3" />
                                <span>No teams</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAssignCoach(coach.id)}
                          disabled={
                            isAssigning || assignCoachMutation.isLoading
                          }
                          className="bg-primary hover:bg-primary/90"
                        >
                          <UserPlus className="w-4 h-4" />
                          Assign
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>All coaches have been assigned</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <div className="text-sm mr-auto content-center text-muted-foreground">
            <span className="font-medium">{assignments?.length || 0}</span>{" "}
            coaches assigned •{" "}
            <span className="font-medium">{unassignedCoaches.length}</span>{" "}
            available
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoachAssignmentModal;
