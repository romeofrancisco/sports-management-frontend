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
import Loading from "../common/FullLoading";
import PlayerStatsSummaryTable from "@/pages/admin/game/components/scoring/PlayerStatsSummaryTable";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { TEAM_SIDES } from "@/constants/game";
import TeamStatsSummaryTable from "@/pages/admin/game/components/scoring/TeamStatsSummaryTable";
import { useTeamStatsSummary } from "@/hooks/useStats";
import { Separator } from "../ui/separator";


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

        <ScrollArea className="max-h-[70vh] w-full min-h-[15rem]">
          <Tabs
            value={activeTab}
            className="min-w-[10rem]"
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full justify-center">
              <TabsTrigger value={TEAM_SIDES.HOME_TEAM}>
                {home_team.name}
              </TabsTrigger>
              <TabsTrigger value={TEAM_SIDES.AWAY_TEAM}>
                {away_team.name}
              </TabsTrigger>
              <TabsTrigger value="team_stats">Team Stats</TabsTrigger>
            </TabsList>

            {isPlayerStatsLoading || isTeamStatsLoading ? (
              <Loading />
            ) : (
              <>
                <TabsContent value={TEAM_SIDES.HOME_TEAM}>
                  <PlayerStatsSummaryTable players={playerStats} />
                </TabsContent>
                <TabsContent value={TEAM_SIDES.AWAY_TEAM}>
                  <PlayerStatsSummaryTable players={playerStats} />
                </TabsContent>
                <TabsContent value="team_stats">
                  <TeamStatsSummaryTable team={teamStats?.home_team || []} />
                  <Separator className="my-5"/>
                  <TeamStatsSummaryTable team={teamStats?.away_team || []} />
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
