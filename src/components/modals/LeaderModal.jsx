import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import LeaderForm from "../forms/LeaderForm";
import { useParams } from "react-router";
import ContentLoading from "../common/ContentLoading";
import { useSportStats } from "@/hooks/useStats";

const LeaderModal = ({ isOpen, onClose, leaderCategory = null }) => {
  const { sport: sportSlug } = useParams();
  const { data: stats, isLoading } = useSportStats(sportSlug);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {leaderCategory ? "Update Leader Category" : "Create Leader Category"}
          </DialogTitle>
          <DialogDescription>
            Configure leader category for game and season statistics
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh]">
          {isLoading ? (
            <ContentLoading />
          ) : (
            <LeaderForm
              onClose={onClose}
              stats={stats}
              sportSlug={sportSlug}
              leaderCategory={leaderCategory}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderModal;