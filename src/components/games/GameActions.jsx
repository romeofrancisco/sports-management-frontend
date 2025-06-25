import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileTextIcon, Users, Play, EditIcon, UserCog } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { useCoachPermissions } from "@/hooks/useCoachPermissions";
import StartingLineupModal from "@/components/modals/StartingLineupModal";
import StartGameConfirmation from "@/components/modals/StartGameConfirmation";
import CoachAssignmentModal from "@/components/modals/CoachAssignmentModal";

export const GameActions = ({
  game,
  isCompleted,
  isLive,
  isScheduled,
  bothReady,
  onEditGame,
}) => {
  const navigate = useNavigate();
  const { isAdmin } = useRolePermissions();
  const { requirePermissionForAction } = useCoachPermissions();
  const [selectedGame, setSelectedGame] = useState(null);
  const [showStartGameConfirmation, setShowStartGameConfirmation] =
    useState(false);
  const startingLineupModal = useModal();
  const coachAssignmentModal = useModal();

  const isLeagueGame = game?.type === "league";

  const handleResultClick = () => {
    navigate(`/games/${game.id}/game-result`);
  };
  const handleLineupClick = () => {
    if (!requirePermissionForAction(game, "lineup")) {
      return; // Permission check will show the error toast
    }
    setSelectedGame(game);
    startingLineupModal.openModal();
  };

  const handleCoachAssignmentClick = () => {
    setSelectedGame(game);
    coachAssignmentModal.openModal();
  };

  const handleStartGame = () => {
    setShowStartGameConfirmation(true);
  };
  const handleResumeGame = () => {
    if (!requirePermissionForAction(game, "resume")) {
      return; // Permission check will show the error toast
    }
    navigate(`/games/${game.id}`);
  };

  const handleEditGame = () => {
    if (!requirePermissionForAction(game, "edit")) {
      return; // Permission check will show the error toast
    }
    if (onEditGame) {
      onEditGame(game);
    }
  }; // Clear selectedGame when modal is fully closed
  useEffect(() => {
    if (
      !startingLineupModal.isOpen &&
      !coachAssignmentModal.isOpen &&
      selectedGame
    ) {
      const timer = setTimeout(() => {
        setSelectedGame(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [startingLineupModal.isOpen, coachAssignmentModal.isOpen, selectedGame]);
  return (
    <>
      {" "}
      <div className="flex flex-wrap gap-2 items-center justify-end">
        {" "}
        {/* Edit button available only for live and scheduled games, not completed */}
        {!isCompleted && (
          <Button
            onClick={handleEditGame}
            variant="outline"
            size="sm"
            className="border-primary/50 text-primary/70 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-300"
          >
            <EditIcon className="mr-1.5 h-3.5 w-3.5" />
            Update
          </Button>
        )}
        {/* Coach Assignment for League Games - Admin Only */}
        {isAdmin() && isLeagueGame && !isCompleted && (
          <Button
            onClick={handleCoachAssignmentClick}
            variant="outline"
            size="sm"
            className="border-amber-500/50 text-amber-700 hover:text-amber-800 hover:bg-amber-50"
          >
            <UserCog className="mr-1.5 h-3.5 w-3.5" />
            Assign Coach
          </Button>
        )}
        {/* Live Game Actions */}
        {isLive && (
          <Button
            onClick={handleResumeGame}
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white border-red-300"
          >
            <Play className="mr-1.5 h-3.5 w-3.5" />
            Resume
          </Button>
        )}
        {/* Completed Game Actions */}
        {/* Note: View Result button moved to appear after score summary in GameCard */}
        {/* Scheduled Game Actions */}
        {isScheduled && (
          <>
            <Button
              onClick={handleLineupClick}
              variant="outline"
              size="sm"
              className="border-secondary/50 text-secondary/70 hover:text-secondary hover:bg-secondary/10"
            >
              <Users className="mr-1.5 h-3.5 w-3.5" />
              Lineup
            </Button>
            {bothReady && (
              <Button onClick={handleStartGame} size="sm">
                <Play className="mr-1.5 h-3.5 w-3.5" />
                Start Game
              </Button>
            )}
          </>
        )}
      </div>{" "}
      {/* Starting Lineup Modal */}
      <StartingLineupModal
        isOpen={startingLineupModal.isOpen}
        onClose={() => {
          startingLineupModal.closeModal();
          // Don't clear selectedGame immediately to prevent null reference errors
          // during form submission. Let it clear when modal fully closes.
        }}
        game={selectedGame}
      />
      {/* Start Game Confirmation Modal */}
      <StartGameConfirmation
        isOpen={showStartGameConfirmation}
        onClose={() => setShowStartGameConfirmation(false)}
        game={game}
      />
      {/* Coach Assignment Modal */}
      <CoachAssignmentModal
        isOpen={coachAssignmentModal.isOpen}
        onClose={() => {
          coachAssignmentModal.closeModal();
        }}
        game={selectedGame}
      />
    </>
  );
};

export default GameActions;
