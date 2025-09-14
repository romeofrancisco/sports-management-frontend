import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PlayerForm from "../forms/PlayerForm";
import { useSports } from "@/hooks/useSports";
import { UserPlus2, UserPen } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

const PlayerModal = ({ isOpen, onClose, player }) => {
  const { data: sports, isLoading: isSportsLoading } = useSports(isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[800px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-background via-primary/5 to-background border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
              {player ? (
                <UserPen className="h-5 w-5 text-primary" />
              ) : (
                <UserPlus2 className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {player ? "Edit Player" : "Register New Player"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {player
                  ? "Update player details and team assignment"
                  : "Register new player and assign team"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-140px)] px-6 pb-6">
          <PlayerForm sports={sports} onClose={onClose} player={player} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerModal;
