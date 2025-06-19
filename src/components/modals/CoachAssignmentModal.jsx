import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, UserMinus, Mail } from "lucide-react";
import Loading from "@/components/common/FullLoading";
import {
  useAvailableCoaches,
  useGameCoachAssignments,
  useAssignCoachToGame,
  useRemoveCoachFromGame,
} from "@/hooks/useGames";

const CoachAssignmentModal = ({ isOpen, onClose, game }) => {
  const [isAssigning, setIsAssigning] = useState(false);

  const { data: availableCoaches, isLoading: isCoachesLoading } = useAvailableCoaches(isOpen);
  const { data: assignments, isLoading: isAssignmentsLoading } = useGameCoachAssignments(game?.id, isOpen);
  
  const assignCoachMutation = useAssignCoachToGame();
  const removeCoachMutation = useRemoveCoachFromGame();

  const isLoading = isCoachesLoading || isAssignmentsLoading;

  const assignedCoachIds = new Set(assignments?.map(assignment => assignment.coach) || []);
  const unassignedCoaches = availableCoaches?.filter(coach => !assignedCoachIds.has(coach.id)) || [];

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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Manage Coach Assignments
          </DialogTitle>
          <DialogDescription>
            Assign coaches to manage this league game: {game?.home_team?.name} vs {game?.away_team?.name}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {/* Currently Assigned Coaches */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Assigned Coaches ({assignments?.length || 0})
              </h3>
              
              {assignments && assignments.length > 0 ? (
                <div className="space-y-2">
                  {assignments.map((assignment) => (
                    <Card key={assignment.id} className="border-green-200 bg-green-50/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{assignment.coach_name}</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Assigned
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {assignment.coach_email}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Assigned by {assignment.assigned_by_name} on{" "}
                              {new Date(assignment.assigned_at).toLocaleDateString()}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveCoach(assignment.coach)}
                            disabled={removeCoachMutation.isLoading}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <UserMinus className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No coaches assigned yet</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Available Coaches */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Available Coaches ({unassignedCoaches.length})
              </h3>
              
              {unassignedCoaches.length > 0 ? (
                <div className="space-y-2">
                  {unassignedCoaches.map((coach) => (
                    <Card key={coach.id} className="border-blue-200 bg-blue-50/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{coach.name}</span>
                              {coach.team && (
                                <Badge variant="outline" className="text-xs">
                                  {coach.team}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {coach.email}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAssignCoach(coach.id)}
                            disabled={isAssigning || assignCoachMutation.isLoading}
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Assign
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>All coaches have been assigned</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoachAssignmentModal;
