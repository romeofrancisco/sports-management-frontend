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

const GameTableActions = ({ game, modals, setSelectedGame, navigate }) => {
  const handleOpen = (modalType) => {
    setSelectedGame(game);
    modals[modalType]?.openModal();
  };

  const goToGameScoring = () => {
    setSelectedGame(game);
    navigate(`/games/${game.id}`);
  };

  const goToBoxscore = () => {
    setSelectedGame(game);
    navigate(`/games/${game.id}/boxscore`);
  };

  const { status, lineup_status } = game;

  const isScheduled = status === GAME_STATUS_VALUES.SCHEDULED;
  const isInProgress = status === GAME_STATUS_VALUES.IN_PROGRESS;
  const isCompleted = status === GAME_STATUS_VALUES.COMPLETED;
  const isPostponed = status === GAME_STATUS_VALUES.POSTPONED;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Scheduled Game Options */}
        {isScheduled && (
          <>
            {lineup_status.home_ready && lineup_status.away_ready && (
              <DropdownMenuItem onClick={() => handleOpen("startGame")}>
                <Play />
                Start Game
              </DropdownMenuItem>
            )}
            {!lineup_status.home_ready && !lineup_status.away_ready ? (
              <DropdownMenuItem onClick={() => handleOpen("startingLineup")}>
                <ClipboardPenLine />
                Register Lineup
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handleOpen("startingLineup")}>
                <ClipboardPenLine />
                Update Lineup
              </DropdownMenuItem>
            )}
          </>
        )}

        {/* In Progress Game Options */}
        {isInProgress && (
          <DropdownMenuItem onClick={goToGameScoring}>
            <StepForward />
            Continue Game
          </DropdownMenuItem>
        )}

        {/* Completed Game Options */}
        {isCompleted && (
          <DropdownMenuItem onClick={goToBoxscore}>
            <ChartColumn />
            Stats Summary
          </DropdownMenuItem>
        )}

        {/* Postponed Game Options */}
        {isPostponed && (
          <>
            <DropdownMenuItem onClick={() => handleOpen("update")}>
              <CalendarSync />
              Reschedule
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={() => handleOpen("update")}>
          <SquarePen />
          Update Game
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => handleOpen("delete")}
        >
          <Trash />
          Delete Game
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GameTableActions;
