import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileTextIcon, Users, Play, EditIcon } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import StartingLineupModal from "@/components/modals/StartingLineupModal";
import StartGameConfirmation from "@/components/modals/StartGameConfirmation";

export const GameActions = ({
  game,
  isCompleted,
  isLive,
  isScheduled,
  bothReady,
  onEditGame,
}) => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);
  const [showStartGameConfirmation, setShowStartGameConfirmation] =
    useState(false);
  const startingLineupModal = useModal();

  const handleResultClick = () => {
    navigate(`/games/${game.id}/game-result`);
  };

  const handleLineupClick = () => {
    setSelectedGame(game);
    startingLineupModal.openModal();
  };

  const handleStartGame = () => {
    setShowStartGameConfirmation(true);
  };

  const handleResumeGame = () => {
    navigate(`/games/${game.id}`);
  };

  const handleEditGame = () => {
    if (onEditGame) {
      onEditGame(game);
    }
  };
  // Clear selectedGame when modal is fully closed
  useEffect(() => {
    if (!startingLineupModal.isOpen && selectedGame) {
      const timer = setTimeout(() => {
        setSelectedGame(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [startingLineupModal.isOpen, selectedGame]);
  return (
    <>
      {" "}
      <div className="flex flex-wrap gap-2 items-center justify-end">
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

        {/* Live Game Actions */}
        {isLive && (
          <>
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-red-50 border border-red-200 rounded-md text-red-600 mr-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-xs uppercase tracking-wide">
                Live
              </span>
            </div>
            <Button
              onClick={handleResumeGame}
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white border-red-300"
            >
              <Play className="mr-1.5 h-3.5 w-3.5" />
              Resume
            </Button>
          </>
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
    </>
  );
};

export default GameActions;
