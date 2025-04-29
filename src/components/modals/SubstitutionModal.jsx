import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCurrentGamePlayers, useGamePlayers } from "@/hooks/useGames";
import { useSelector } from "react-redux";
import SubstitutionForm from "../forms/SubstitutionForm";
import ContentLoading from "../common/ContentLoading";
import { ScrollArea } from "../ui/scroll-area";
import { useParams } from "react-router";

const SubstitutionModal = ({ isOpen, onClose }) => {
  const { gameId } = useParams();
  const { data: currentPlayers, isLoading: isCurrentPlayersLoading } =
    useCurrentGamePlayers(gameId, isOpen);
  const { data: gamePlayers, isLoading: isGamePlayersLoading } = useGamePlayers(
    gameId,
    isOpen
  );

  const isLoading = isCurrentPlayersLoading || isGamePlayersLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Substitution</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh]">
          {isLoading ? (
            <ContentLoading />
          ) : (
            <SubstitutionForm
              currentPlayers={currentPlayers}
              gamePlayers={gamePlayers}
              onClose={onClose}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SubstitutionModal;
