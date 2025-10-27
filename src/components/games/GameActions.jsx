import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileTextIcon,
  Users,
  Play,
  EditIcon,
  UserCog,
  Trash2,
} from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { useCoachPermissions } from "@/hooks/useCoachPermissions";
import StartingLineupModal from "@/components/modals/StartingLineupModal";
import StartGameConfirmation from "@/components/modals/StartGameConfirmation";
import CoachAssignmentModal from "@/components/modals/CoachAssignmentModal";
import DeleteGameModal from "@/components/modals/DeleteGameModal";

export const GameActions = ({
  game,
  isCompleted,
  isLive,
  isScheduled,
  bothReady,
  onEditGame,
}) => {
  const navigate = useNavigate();
  const { isAdmin, permissions } = useRolePermissions();
  const { requirePermissionForAction } = useCoachPermissions();
  const [selectedGame, setSelectedGame] = useState(null);
  const [showStartGameConfirmation, setShowStartGameConfirmation] =
    useState(false);
  const startingLineupModal = useModal();
  const coachAssignmentModal = useModal();
  const deleteGameModal = useModal();

  const isLeagueGame = game?.type === "league";
  const isPracticeGame = game?.type === "practice";
  const canDeleteGame = permissions.games.delete(game);
  
  // Check if sport requires stats (for lineup requirements)
  const sportRequiresStats = game?.sport_requires_stats ?? true;
  
  // Determine if game can be started
  // For stat-tracking sports: need both teams ready
  // For scoreboard-only sports: can start without lineup
  const canStartGame = sportRequiresStats ? bothReady : true;

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
  };

  const handleDeleteGame = () => {
    setSelectedGame(game);
    deleteGameModal.openModal();
  }; // Clear selectedGame when modal is fully closed
  useEffect(() => {
    if (
      !startingLineupModal.isOpen &&
      !coachAssignmentModal.isOpen &&
      !deleteGameModal.isOpen &&
      selectedGame
    ) {
      const timer = setTimeout(() => {
        setSelectedGame(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [
    startingLineupModal.isOpen,
    coachAssignmentModal.isOpen,
    deleteGameModal.isOpen,
    selectedGame,
  ]);
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
            <EditIcon />
            Update
          </Button>
        )}
        {/* Delete button for practice games only */}
        {isPracticeGame && canDeleteGame && (
          <Button
            onClick={handleDeleteGame}
            variant="outline"
            size="sm"
            className="border-red-500/50 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-500 transition-all duration-300"
          >
            <Trash2 />
            Delete
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
            <UserCog />
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
            <Play />
            Resume
          </Button>
        )}
        {/* Completed Game Actions */}
        {/* Note: View Result button moved to appear after score summary in GameCard */}
        {/* Scheduled Game Actions */}
        {isScheduled && (
          <>
            {/* Only show lineup button for sports that require stats */}
            {sportRequiresStats && (
              <Button
                onClick={handleLineupClick}
                variant="outline"
                size="sm"
                className="border-secondary/50 text-secondary/70 hover:text-secondary hover:bg-secondary/10"
              >
                <Users />
                Lineup
              </Button>
            )}
            {canStartGame && (
              <Button onClick={handleStartGame} size="sm">
                <Play />
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
      {/* Delete Game Modal */}
      <DeleteGameModal
        isOpen={deleteGameModal.isOpen}
        onClose={() => {
          deleteGameModal.closeModal();
        }}
        game={selectedGame}
      />
    </>
  );
};

export default GameActions;
