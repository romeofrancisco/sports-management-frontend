import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlayerStatsSummary } from "@/hooks/useStats";
import { useSelector } from "react-redux";
import FullPageLoading from "../common/FullPageLoading";
import PlayerStatsSummaryTable from "@/pages/admin/game/components/scoring/PlayerStatsSummaryTable";
import { ScrollArea } from "../ui/scroll-area";
import { TEAM_SIDES } from "@/constants/game";
import TeamStatsSummary from "@/pages/admin/game/components/scoring/TeamStatsSummary";
import { useTeamStatsSummary } from "@/hooks/useStats";


const SummaryStatsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(TEAM_SIDES.HOME_TEAM);
  const { game_id, home_team, away_team } = useSelector((state) => state.game);

  const {
    data: playerStats,
    isLoading: isPlayerStatsLoading,
    refetch: refetchPlayerStats,
  } = usePlayerStatsSummary(game_id, activeTab, isOpen);
  const {
    data: teamStats,
    isLoading: isTeamStatsLoading,
    refetch: refetchTeamStats,
  } = useTeamStatsSummary(game_id, isOpen);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(TEAM_SIDES.HOME_TEAM);
      refetchPlayerStats();
      refetchTeamStats();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      refetchPlayerStats();
    }
  }, [activeTab]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80rem]">
        <DialogHeader>
          <DialogTitle>Summary Stats</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] w-full min-h-[15rem]">
          <Tabs
            value={activeTab}
            className="min-w-[10rem]"
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full justify-center sticky top-0 z-10 bg-muted border shadow-sm">
              <TabsTrigger value={TEAM_SIDES.HOME_TEAM}>
                {home_team.name}
              </TabsTrigger>
              <TabsTrigger value={TEAM_SIDES.AWAY_TEAM}>
                {away_team.name}
              </TabsTrigger>
              <TabsTrigger value="team_stats">Team Stats</TabsTrigger>
            </TabsList>

            {isPlayerStatsLoading || isTeamStatsLoading ? (
              <FullPageLoading />
            ) : (
              <>
                <TabsContent value={TEAM_SIDES.HOME_TEAM}>
                  <PlayerStatsSummaryTable players={playerStats} />
                </TabsContent>
                <TabsContent value={TEAM_SIDES.AWAY_TEAM}>
                  <PlayerStatsSummaryTable players={playerStats} />
                </TabsContent>
                <TabsContent value="team_stats">
                  <TeamStatsSummary
                    teamStats={teamStats}
                  />
                </TabsContent>
              </>
            )}
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SummaryStatsModal;
