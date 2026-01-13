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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useManageGame } from "@/hooks/useGames";
import { GAME_ACTIONS } from "@/constants/game";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { Flag } from "lucide-react";

const ForfeitGameModal = ({ isOpen, onClose, game: propGame }) => {
  const { gameId } = useParams();
  // Get game data from Redux store - the slice has home_team, away_team, game_id directly
  const gameState = useSelector((state) => state.game);
  
  // Build game object from Redux state or use propGame
  const game = propGame || (gameState.game_id ? {
    id: gameState.game_id,
    home_team: gameState.home_team,
    away_team: gameState.away_team,
  } : null);
  
  const gameIdToUse = game?.id || gameId;
  
  const [forfeitingTeamId, setForfeitingTeamId] = useState("");
  const { mutate: manageGame, isPending } = useManageGame(gameIdToUse);
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (!forfeitingTeamId) return;

    manageGame(
      { 
        action: GAME_ACTIONS.FORFEIT,
        extraData: { forfeiting_team_id: parseInt(forfeitingTeamId) }
      },
      {
        onSuccess: () => {
          setForfeitingTeamId("");
          onClose();
          navigate(`/games/${gameIdToUse}/game-result`, { replace: true });
        },
        onError: (error) => {
          console.error("Forfeit error:", error);
        },
      }
    );
  };

  const handleClose = () => {
    setForfeitingTeamId("");
    onClose();
  };

  // Reset forfeitingTeamId when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setForfeitingTeamId("");
    }
  }, [isOpen]);

  // Don't render if no game data or modal not open
  if (!isOpen) return null;
  
  if (!game || !gameIdToUse) {
    console.warn("ForfeitGameModal: No game data available", { game, gameIdToUse, gameState });
    return null;
  }

  const homeTeam = game.home_team;
  const awayTeam = game.away_team;
  
  if (!homeTeam || !awayTeam) {
    console.warn("ForfeitGameModal: Missing team data", { homeTeam, awayTeam });
    return null;
  }
  const forfeitingTeam = forfeitingTeamId 
    ? (parseInt(forfeitingTeamId) === homeTeam?.id ? homeTeam : awayTeam)
    : null;
  const winningTeam = forfeitingTeamId
    ? (parseInt(forfeitingTeamId) === homeTeam?.id ? awayTeam : homeTeam)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Flag className="h-5 w-5" />
            Forfeit Game
          </DialogTitle>
          <DialogDescription>
            End the game early due to a team being unable to continue playing.
            The opposing team will be awarded the win.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Which team is forfeiting?</label>
            <Select value={forfeitingTeamId} onValueChange={setForfeitingTeamId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select forfeiting team..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(homeTeam?.id)}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{homeTeam?.name}</span>
                    <span className="text-xs text-muted-foreground">Home Team</span>
                  </div>
                </SelectItem>
                <SelectItem value={String(awayTeam?.id)}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{awayTeam?.name}</span>
                    <span className="text-xs text-muted-foreground">Away Team</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {forfeitingTeam && winningTeam && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              <p className="font-medium mb-2">Forfeit Summary:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <span className="font-medium">{forfeitingTeam.name}</span> forfeits the game
                </li>
                <li>
                  <span className="font-medium">{winningTeam.name}</span> wins by forfeit
                </li>
                <li>Current scores will be preserved in the record</li>
                <li>This action cannot be undone</li>
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!forfeitingTeamId || isPending}
            variant="destructive"
          >
            {isPending ? "Processing..." : "Confirm Forfeit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForfeitGameModal;
