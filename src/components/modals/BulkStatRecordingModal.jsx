import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BulkStatRecording from "@/components/games/BulkStatRecording";
import { useCurrentGamePlayers } from "@/hooks/useGames";
import { useRecordableStats } from "@/hooks/useSports";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

const BulkStatRecordingModal = ({ isOpen, onClose }) => {
  const { game_id } = useSelector((state) => state.game);
  
  // Fetch the required data
  const { data: currentPlayers, isLoading: isPlayersLoading } = useCurrentGamePlayers(game_id);
  const { data: statTypes, isLoading: isStatTypesLoading } = useRecordableStats(game_id);

  const isLoading = isPlayersLoading || isStatTypesLoading;

  // Combine players from both teams
  const allPlayers = currentPlayers 
    ? [...(currentPlayers.home_players || []), ...(currentPlayers.away_players || [])]
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Stat Recording</DialogTitle>
          <DialogDescription>
            Record multiple stats efficiently using different performance modes.
            Choose the best recording method based on your needs.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading players and stats...</span>
          </div>
        ) : (
          <BulkStatRecording 
            players={allPlayers}
            statTypes={statTypes}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BulkStatRecordingModal;
