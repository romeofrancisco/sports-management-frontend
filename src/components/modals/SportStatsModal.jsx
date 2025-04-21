import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SportStatsForm from "../forms/SportStatsForm";
import { useSportStats } from "@/hooks/useSports";
import { useParams } from "react-router";
import ContentLoading from "../common/ContentLoading";
import { ScrollArea } from "../ui/scroll-area";

const SportStatsModal = ({ isOpen, onClose, stat }) => {
  const { sport } = useParams();
  const { data, isLoading } = useSportStats(sport);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Stat</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh]">
          {isLoading ? (
            <ContentLoading />
          ) : (
            <SportStatsForm
              onClose={onClose}
              stat={stat}
              compositeStats={data}
              sport={sport}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SportStatsModal;
