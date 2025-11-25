import React from "react";
import { useManageTournament } from "@/hooks/useTournaments";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  CheckCircle,
  XCircle,
  MoreVertical,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

const TournamentActions = ({ tournament }) => {
  const { mutate: manageTournament, isPending } = useManageTournament();

  const handleAction = (action) => {
    manageTournament({ tournamentId: tournament.id, action });
  };

  const canStart =
    tournament.status === "upcoming" || tournament.status === "paused";
  const canPause = tournament.status === "ongoing";
  const canComplete = tournament.status === "ongoing";
  const canCancel =
    tournament.status !== "completed" && tournament.status !== "canceled";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="gap-2"
          disabled={isPending}
        >
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {canStart && (
          <DropdownMenuItem
            onClick={() => handleAction("start")}
            disabled={isPending}
            className="cursor-pointer"
          >
            <Play />
            Start Tournament
          </DropdownMenuItem>
        )}

        {canComplete && (
          <>
            <DropdownMenuItem
              onClick={() => handleAction("complete")}
              disabled={isPending}
              className="cursor-pointer text-green-600 focus:text-green-600"
            >
              <CheckCircle />
              Complete Tournament
            </DropdownMenuItem>
          </>
        )}

        {canPause && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleAction("pause")}
              disabled={isPending}
              className="cursor-pointer"
            >
              <Pause />
              Pause Tournament
            </DropdownMenuItem>
          </>
        )}

        {canCancel && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleAction("cancel")}
              disabled={isPending}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <XCircle />
              Cancel Tournament
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TournamentActions;
