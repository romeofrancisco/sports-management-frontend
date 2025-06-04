import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Trash,
  SquarePen,
  ClipboardPenLine,
  CalendarSync,
  ChartColumn,
  StepForward,
  Play,
} from "lucide-react";
import { GAME_STATUS_VALUES } from "@/constants/game";
import { useRolePermissions } from "@/hooks/useRolePermissions";

const GameTableActions = ({ game, modals, setSelectedGame, navigate }) => {
  const { permissions } = useRolePermissions();
  
  const handleOpen = (modalType) => {
    setSelectedGame(game);
    modals[modalType]?.openModal();
  };

  const goToGameScoring = () => {
    setSelectedGame(game);
    navigate(`/games/${game.id}`);
  };

  const gotoGameResult = () => {
    setSelectedGame(game);
    navigate(`/games/${game.id}/game-result`);
  };

  const { status, lineup_status } = game;

  const isScheduled = status === GAME_STATUS_VALUES.SCHEDULED;
  const isInProgress = status === GAME_STATUS_VALUES.IN_PROGRESS;
  const isCompleted = status === GAME_STATUS_VALUES.COMPLETED;
  const isPostponed = status === GAME_STATUS_VALUES.POSTPONED;

  // Permission checks
  const canStartGame = permissions.games.start(game);
  const canManageLineup = permissions.games.manage(game);
  const canUpdateGame = permissions.games.edit(game);
  const canDeleteGame = permissions.games.delete(game);
  const canRecordScores = permissions.games.recordScores(game);

  // If user has no permissions for this game, don't show any actions
  const hasAnyPermission = canStartGame || canManageLineup || canUpdateGame || canDeleteGame || canRecordScores;
  
  if (!hasAnyPermission) {
    return null; // Don't render the dropdown if user has no permissions
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>      <DropdownMenuContent align="end">
        {/* Scheduled Game Options */}
        {isScheduled && (
          <>
            {lineup_status.home_ready && lineup_status.away_ready && canStartGame && (
              <DropdownMenuItem onClick={() => handleOpen("startGame")}>
                <Play />
                Start Game
              </DropdownMenuItem>
            )}
            {canManageLineup && (
              !lineup_status.home_ready && !lineup_status.away_ready ? (
                <DropdownMenuItem onClick={() => handleOpen("startingLineup")}>
                  <ClipboardPenLine />
                  Register Lineup
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleOpen("startingLineup")}>
                  <ClipboardPenLine />
                  Update Lineup
                </DropdownMenuItem>
              )
            )}
          </>
        )}

        {/* In Progress Game Options */}
        {isInProgress && canRecordScores && (
          <DropdownMenuItem onClick={goToGameScoring}>
            <StepForward />
            Continue Game
          </DropdownMenuItem>
        )}

        {/* Completed Game Options */}
        {isCompleted && (
          <DropdownMenuItem onClick={gotoGameResult}>
            <ChartColumn />
            Stats Summary
          </DropdownMenuItem>
        )}

        {/* Postponed Game Options */}
        {isPostponed && canUpdateGame && (
          <>
            <DropdownMenuItem onClick={() => handleOpen("update")}>
              <CalendarSync />
              Reschedule
            </DropdownMenuItem>
          </>
        )}
        
        {canUpdateGame && (
          <DropdownMenuItem onClick={() => handleOpen("update")}>
            <SquarePen />
            Update Game
          </DropdownMenuItem>
        )}
        
        {canDeleteGame && (
          <DropdownMenuItem
            variant="destructive"
            onClick={() => handleOpen("delete")}
          >
            <Trash />
            Delete Game
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GameTableActions;
