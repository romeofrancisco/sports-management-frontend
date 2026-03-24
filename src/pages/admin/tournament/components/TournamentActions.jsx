import React, { useState } from "react";
import {
  useManageTournament,
  useDeleteTournamentBracket,
} from "@/hooks/useTournaments";
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
  Settings,
  Trash2,
} from "lucide-react";
import DeleteModal from "@/components/common/DeleteModal";

const TournamentActions = ({ tournament }) => {
  const { mutate: manageTournament, isPending } = useManageTournament();
  const { mutate: deleteBracket, isPending: isDeletingBracket } =
    useDeleteTournamentBracket();
  const [showDeleteBracketConfirm, setShowDeleteBracketConfirm] = useState(false);

  const handleAction = (action) => {
    manageTournament({ tournamentId: tournament.id, action });
  };

  const handleDeleteBracket = () => {
    deleteBracket(
      { tournamentId: tournament.id },
      {
        onSuccess: () => {
          setShowDeleteBracketConfirm(false);
        },
      }
    );
  };

  const canStart =
    tournament.status === "upcoming" || tournament.status === "paused";
  const canPause = tournament.status === "ongoing";
  const canComplete = tournament.status === "ongoing";
  const canCancel =
    tournament.status !== "completed" && tournament.status !== "canceled";
  const canDeleteBracket = tournament.has_bracket;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="gap-2"
            disabled={isPending || isDeletingBracket}
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

          {canDeleteBracket && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteBracketConfirm(true)}
                disabled={isDeletingBracket}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 />
                Delete Bracket
              </DropdownMenuItem>
            </>
          )}

          {/* {canCancel && (
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
          )} */}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteModal
        open={showDeleteBracketConfirm}
        onOpenChange={setShowDeleteBracketConfirm}
        onConfirm={handleDeleteBracket}
        title="Delete Bracket"
        description="This will delete the bracket and all games created by that bracket. You can only delete it when no bracket game is ongoing or completed."
        confirmText="Delete Bracket"
        cancelText="Cancel"
        itemType="bracket"
        isLoading={isDeletingBracket}
      />
    </>
  );
};

export default TournamentActions;
