import React from "react";
import SeasonForm from "../forms/SeasonForm";
import { useSportTeams } from "@/hooks/useTeams";
import FullPageLoading from "../common/FullPageLoading";
import { useParams } from "react-router";
import { useLeagueDetails } from "@/hooks/useLeagues";
import Modal from "../common/Modal";
import { Calendar } from "lucide-react";

const SeasonModal = ({ isOpen, onClose, sport, season = null }) => {
  const { league } = useParams();
  const { data: leagueDetails, isLoading: isLeagueLoading } =
    useLeagueDetails(league);
  const { data: teams, isLoading: isTeamsLoading } = useSportTeams(
    sport?.slug,
    leagueDetails?.division,
  );

  if (isTeamsLoading || isLeagueLoading) return <FullPageLoading />;

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      title={season ? "Edit Season" : "Create New Season"}
      description={
        season
          ? "Update season details and participating teams"
          : "Enter details to create a new season and select participating teams"
      }
      size="sm"
      icon={Calendar}
    >
      <SeasonForm teams={teams} onClose={onClose} season={season} />
    </Modal>
  );
};

export default SeasonModal;
