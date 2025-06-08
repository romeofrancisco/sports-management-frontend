import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SportForm from "../forms/SportForm";
import { ScrollArea } from "../ui/scroll-area";
import { Trophy, Settings } from "lucide-react";

const SportModal = ({ isOpen, onClose, sport }) => {
  const isEdit = !!sport;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[650px] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-background via-primary/5 to-background border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
              {isEdit ? (
                <Settings className="h-5 w-5 text-primary" />
              ) : (
                <Trophy className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {isEdit ? "Edit Sport Settings" : "Register New Sport"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                {isEdit
                  ? "Update the configuration and rules for this sport"
                  : "Configure the rules and settings for a new sport"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-140px)] px-6 pb-6">
          <SportForm onClose={onClose} sport={sport} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SportModal;
