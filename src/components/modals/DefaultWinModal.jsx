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
import { AlertTriangle } from "lucide-react";

const DefaultWinModal = ({ isOpen, onClose, game }) => {
  const [defaultType, setDefaultType] = useState("");
  const { mutate: manageGame, isPending } = useManageGame(game?.id);

  const handleConfirm = () => {
    if (!defaultType) return;

    const actionMap = {
      home_win: GAME_ACTIONS.DEFAULT_HOME_WIN,
      away_win: GAME_ACTIONS.DEFAULT_AWAY_WIN,
      double_default: GAME_ACTIONS.DOUBLE_DEFAULT,
    };

    manageGame(
      { action: actionMap[defaultType] },
      {
        onSuccess: () => {
          setDefaultType("");
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    setDefaultType("");
    onClose();
  };

  if (!game) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Record Default Win
          </DialogTitle>
          <DialogDescription>
            Record a default result when one or both teams fail to show up for the game.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Default Type</label>
            <Select value={defaultType} onValueChange={setDefaultType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select default type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home_win">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">
                      {game.home_team?.name} wins by default
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Away team ({game.away_team?.name}) didn't show up
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="away_win">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">
                      {game.away_team?.name} wins by default
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Home team ({game.home_team?.name}) didn't show up
                    </span>
                  </div>
                </SelectItem>
                {/* <SelectItem value="double_default">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Double Default</span>
                    <span className="text-xs text-muted-foreground">
                      Neither team showed up - no winner
                    </span>
                  </div>
                </SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          {defaultType && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
              <p className="font-medium">Note:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>This action cannot be undone</li>
                <li>The game will be marked as finished</li>
                <li>
                  {defaultType === "double_default"
                    ? "Both teams will receive a default loss in standings"
                    : "Standings will be updated with a default win/loss"}
                </li>
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
            disabled={!defaultType || isPending}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isPending ? "Recording..." : "Record Default"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DefaultWinModal;
