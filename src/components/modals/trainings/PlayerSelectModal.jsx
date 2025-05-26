import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ATTENDANCE_STATUS,
  ATTENDANCE_STATUS_LABELS,
} from "@/constants/trainings";
import { UserIcon, Settings, ClipboardPenLine } from "lucide-react";
import PlayerMetricsConfigModal from "@/components/trainings/metrics/PlayerMetricsConfigModal";

// Status styles matching the maroon/gold design system
const statusStyles = {
  present: {
    bg: "rgba(139,21,56,0.08)",
    color: "#8B1538",
    hoverBg: "rgba(139,21,56,0.25)",
    border: "border-red-900",
  },
  absent: {
    bg: "rgba(220,20,60,0.08)",
    color: "#DC143C",
    hoverBg: "rgba(220,20,60,0.25)",
    border: "border-red-600",
  },
  pending: {
    bg: "rgba(184,134,11,0.08)",
    color: "#B8860B",
    hoverBg: "rgba(184,134,11,0.25)",
    border: "border-yellow-600",
  },
  excused: {
    bg: "rgba(255,215,0,0.08)",
    color: "#FFD700",
    hoverBg: "rgba(255,215,0,0.25)",
    border: "border-yellow-500",
  },
  late: {
    bg: "rgba(218,165,32,0.08)",
    color: "#DAA520",
    hoverBg: "rgba(218,165,32,0.25)",
    border: "border-yellow-500",
  },
};

const PlayerSelectModal = ({
  isOpen,
  onClose,
  players = [],
  onSelectPlayer,
  sessionMetrics = [],
  onDataRefresh, // Add callback to refresh session data
  selectedSession, // Add selectedSession to get fresh data
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

    // Handle auto-selection for single player
  useEffect(() => {
    if (players.length === 1) {
      const player = players[0];
      if (
        player.attendance_status === ATTENDANCE_STATUS.PRESENT ||
        player.attendance_status === ATTENDANCE_STATUS.LATE
      ) {
        onSelectPlayer(player);
        onClose();
      }
    }
  }, [players, onSelectPlayer, onClose]);

  // Update selectedPlayer when players data changes (after refresh)
  useEffect(() => {
    if (selectedPlayer && players.length > 0) {
      const updatedPlayer = players.find(p => p.id === selectedPlayer.id);
      if (updatedPlayer) {
        setSelectedPlayer(updatedPlayer);
      }
    }
  }, [players, selectedPlayer]);

  // Filter only players with present or late status
  const availablePlayers = players.filter(
    (player) =>
      player.attendance_status === ATTENDANCE_STATUS.PRESENT ||
      player.attendance_status === ATTENDANCE_STATUS.LATE
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="pb-2">
          <DialogTitle>Select a Player to Record Metrics</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-2">
          <div className="space-y-2 pb-2 max-7">
            {availablePlayers.length === 0 ? (
              <div className="text-center p-8 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
                <div className="bg-muted/40 p-3 rounded-full mx-auto mb-4 w-fit">
                  <UserIcon className="h-10 w-10 text-muted-foreground/60" />
                </div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  No Players Present
                </h4>
                <p className="text-xs text-muted-foreground max-w-[250px] mx-auto mb-3">
                  No players are currently marked as present for this training
                  session.
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded-full w-fit mx-auto">
                  <ClipboardPenLine className="h-3 w-3" />
                  <span>Mark attendance first to proceed</span>
                </div>
              </div>
            ) : (
              availablePlayers.map((player) => {
                const status =
                  player.attendance_status || ATTENDANCE_STATUS.PENDING;
                const style = statusStyles[status] || statusStyles.pending;

                return (
                  <Button
                    key={player.id}
                    variant="outline"
                    className={cn(
                      "w-full h-auto flex flex-col items-start px-4 py-3 hover:bg-muted/50",
                      "border"
                    )}
                  >
                    <div className="w-full flex justify-between items-center">
                      <div className="flex flex-col items-start overflow-hidden flex-1 mr-2">
                        <span className="font-medium truncate w-full">
                          {player.player_name}
                        </span>
                      </div>
                      <div
                        className="px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap"
                        style={{
                          backgroundColor: style.bg,
                          color: style.color,
                        }}
                      >
                        {ATTENDANCE_STATUS_LABELS[status] ||
                          status.charAt(0).toUpperCase() + status.slice(1)}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full mt-3">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          onSelectPlayer(player);
                          onClose();
                        }}
                      >
                        <ClipboardPenLine className="h-4 w-4 mr-2" />
                        Record Metrics
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedPlayer(player);
                          setIsConfigModalOpen(true);
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure Metrics
                      </Button>
                    </div>
                  </Button>
                );
              })
            )}
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4 border-t mt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>        {/* Player Metrics Configuration Modal */}
        {selectedPlayer && (
          <PlayerMetricsConfigModal
            isOpen={isConfigModalOpen}
            onClose={async () => {
              setIsConfigModalOpen(false);
              
              // Refresh session data - this will trigger the useEffect above to update selectedPlayer
              if (onDataRefresh) {
                await onDataRefresh();
              }
            }}
            playerTraining={selectedPlayer}
            sessionMetrics={sessionMetrics}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlayerSelectModal;
