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
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal";
import ContentEmpty from "../common/ContentEmpty";

const CoachAssignmentModal = ({ isOpen, onClose, game }) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const navigate = useNavigate();

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
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      title="Coach Assignments"
      description="Manage coach assignments for this game"
      icon={Shield}
    >
      {/* Assigned Coaches Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-primary">Assigned Coaches</h3>
          <Badge variant="secondary" className="text-xs">
            {assignments?.length || 0}
          </Badge>
        </div>

        {assignments && assignments.length > 0 ? (
          <div className="space-y-2">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-3 border border-primary/20 rounded-md bg-primary/5"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={assignment.profile}
                      alt={assignment.coach_name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {assignment.coach_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-sm">
                      {assignment.coach_name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {assignment.coach_email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveCoach(assignment.coach)}
                  disabled={removeCoachMutation.isLoading}
                >
                  <UserMinus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <ContentEmpty
            title="No coaches assigned"
            icon={Users}
            description="No coaches have been assigned to this game yet."
          />
        )}
      </div>

      {/* Available Coaches Section */}
      <div className="space-y-4 my-4">
        <div className="flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-secondary-foreground" />
          <h3 className="font-semibold">Available Coaches</h3>
          <Badge variant="outline" className="text-xs">
            {unassignedCoaches.length}
          </Badge>
        </div>

        {unassignedCoaches.length > 0 ? (
          <div className="space-y-2">
            {unassignedCoaches.map((coach) => (
              <div
                key={coach.id}
                className="flex items-center justify-between p-3 border border-primary/20 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8 border border-primary/30">
                    <AvatarImage src={coach.profile} alt={coach.name} />
                    <AvatarFallback className="text-sm">
                      {coach.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-sm">{coach.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {coach.email}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAssignCoach(coach.id)}
                  disabled={isAssigning || assignCoachMutation.isLoading}
                  className="bg-primary hover:bg-primary/90"
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <ContentEmpty
            title="No coaches available"
            icon={Users}
            description="No unassigned coaches are available."
            action={{
              label: "Add Coaches",
              logo: UserPlus,
              onClick: () => {
                navigate("/coaches");
              },
            }}
          />
        )}
      </div>
    </Modal>
  );
};

export default CoachAssignmentModal;
