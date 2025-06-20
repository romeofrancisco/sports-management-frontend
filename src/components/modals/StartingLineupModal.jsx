import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import Loading from "../common/FullLoading";
import StartingLineupForm from "../forms/StartingLineupForm";
import { useGamePlayers } from "@/hooks/useGames";
import { useStartingLineup } from "@/hooks/useStartingLineup";
import { useSportDetails } from "@/hooks/useSports";
import { useCoachPermissions } from "@/hooks/useCoachPermissions";

const StartingLineupModal = ({ isOpen, onClose, game }) => {
  const { data: gamePlayers, isLoading: isGamePlayersLoading } = useGamePlayers(game?.id, isOpen);
  const { data: lineup, isLoading: isLineupLoading } = useStartingLineup(game?.id, isOpen)
  const { data: sport, isLoading: isSportLoading } = useSportDetails(game?.sport_slug)
  const { checkGamePermission } = useCoachPermissions();

  const isLoading = isGamePlayersLoading || isLineupLoading || isSportLoading

  if (isLoading) return <Loading />;

  // Check permissions - if no permission, show error content instead of closing
  const hasPermission = game ? checkGamePermission(game) : false;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create starting lineup</DialogTitle>
          <DialogDescription>
            Set the starting line up for {game?.home_team.name} and{" "}
            {game?.away_team.name}
          </DialogDescription>        </DialogHeader>
        <Separator className="min-h-px" />
        <ScrollArea className="max-h-[75vh]">
          {hasPermission ? (
            <StartingLineupForm 
              onClose={onClose}
              teams={gamePlayers} 
              lineup={lineup}
              game={game} 
              sport={sport}
            />
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                You don't have permission to manage the lineup for this game.
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Please contact an administrator to get assigned to this league game.
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default StartingLineupModal;
