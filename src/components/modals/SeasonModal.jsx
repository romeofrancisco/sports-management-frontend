import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SeasonForm from "../forms/SeasonForm";
import { useSportTeams } from "@/hooks/useTeams";
import { ScrollArea } from "../ui/scroll-area";
import FullPageLoading from "../common/FullPageLoading";
import { useParams } from "react-router";
import { useLeagueDetails } from "@/hooks/useLeagues";

const SeasonModal = ({ isOpen, onClose, sport, season = null }) => {
  const { league } = useParams();
  const { data: leagueDetails, isLoading: isLeagueLoading } =
    useLeagueDetails(league);
  const { data: teams, isLoading: isTeamsLoading } = useSportTeams(
    sport?.slug,
    leagueDetails?.division
  );

  if (isTeamsLoading || isLeagueLoading) return <FullPageLoading />;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {season ? "Edit Season" : "Create New Season"}
          </DialogTitle>
          <DialogDescription>
            {season
              ? "Update the season details below."
              : "Fill in the details to create a new season."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh] pr-3">
          <SeasonForm teams={teams} onClose={onClose} season={season} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SeasonModal;
