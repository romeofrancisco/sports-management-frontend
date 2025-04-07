import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlayerSummaryStats } from "@/hooks/usePlayerStats";
import { useSelector } from "react-redux";
import Loading from "../common/Loading";
import PlayerStatsSummaryTable from "@/pages/common/components/PlayerStatsSummaryTable";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { TEAM_SIDES } from "@/constants/game";

const SummaryStatsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(TEAM_SIDES.HOME_TEAM);
  const { id, home_team, away_team } = useSelector((state) => state.game);

  const {
    data: playerStats,
    isLoading: isPlayerStatsLoading,
    refetch,
  } = usePlayerSummaryStats(id, activeTab, isOpen);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(TEAM_SIDES.HOME_TEAM);
      refetch();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [activeTab]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[60rem]">
        <DialogHeader>
          <DialogTitle>Summary Stats</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] w-full overflow-x-auto min-h-[15rem]">
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

            {isPlayerStatsLoading ? (
              <Loading />
            ) : (
              <>
                <TabsContent value={TEAM_SIDES.HOME_TEAM}>
                  <PlayerStatsSummaryTable players={playerStats} />
                </TabsContent>
                <TabsContent value={TEAM_SIDES.AWAY_TEAM}>
                  <PlayerStatsSummaryTable players={playerStats} />
                </TabsContent>
                <TabsContent value="team_stats">Team Stats</TabsContent>
              </>
            )}
          </Tabs>
          <ScrollBar orientation="horizontal" className="w-full" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SummaryStatsModal;
