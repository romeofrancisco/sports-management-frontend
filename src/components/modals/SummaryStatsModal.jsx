import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePlayerStatsSummary } from "@/hooks/useStats";
import { useSelector } from "react-redux";
import FullPageLoading from "../common/FullPageLoading";
import PlayerStatsSummaryTable from "@/pages/admin/game/components/scoring/PlayerStatsSummaryTable";
import { ScrollArea } from "../ui/scroll-area";
import { TEAM_SIDES } from "@/constants/game";
import { SCORING_TYPE_VALUES } from "@/constants/sport";
import TeamStatsSummary from "@/pages/admin/game/components/scoring/TeamStatsSummary";
import { useTeamStatsSummary } from "@/hooks/useStats";
import { FileText } from "lucide-react";

const SummaryStatsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(TEAM_SIDES.HOME_TEAM);
  const [selectedPeriod, setSelectedPeriod] = useState("total");
  const { game_id, home_team, away_team } = useSelector((state) => state.game);
  const { scoring_type } = useSelector((state) => state.sport);

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

  // Get available periods from team stats
  const availablePeriods =
    teamStats?.home_team?.periods?.map((period) => ({
      value: period.period,
      label: `Set ${period.period}`,
    })) || [];

  useEffect(() => {
    if (isOpen) {
      setActiveTab(TEAM_SIDES.HOME_TEAM);
      setSelectedPeriod("total");
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
          <div className="flex gap-2">
            <div className="flex items-center gap-2 flex-1">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-gradient">
                  Summary Stats
                </DialogTitle>
                <DialogDescription className="line-clamp-1">
                  Summary statistics for the game, including player and team
                  performance metrics.
                </DialogDescription>
              </div>
            </div>
            {/* Period Selector for Set-Based Sports */}
            {scoring_type === SCORING_TYPE_VALUES.SETS &&
              availablePeriods.length > 0 && (
                <div className="flex items-center gap-2 lg:justify-end">
                  <span className="text-sm font-medium text-muted-foreground">
                    Period:
                  </span>
                  <Select
                    value={selectedPeriod?.toString()}
                    onValueChange={(value) =>
                      setSelectedPeriod(
                        value === "total" ? "total" : parseInt(value)
                      )
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select a Set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="total">All Sets</SelectItem>
                      {availablePeriods.map((period) => (
                        <SelectItem
                          key={period.value}
                          value={period.value.toString()}
                        >
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] w-full min-h-[15rem]">
          <Tabs
            value={activeTab}
            className="min-w-[10rem]"
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full justify-center sticky top-0 z-60 bg-muted border shadow-sm">
              <TabsTrigger value={TEAM_SIDES.HOME_TEAM}>
                {home_team?.name || "Home Team"}
              </TabsTrigger>
              <TabsTrigger value="team_stats">Team Stats</TabsTrigger>
              <TabsTrigger value={TEAM_SIDES.AWAY_TEAM}>
                {away_team?.name || "Away Team"}
              </TabsTrigger>
            </TabsList>

            {isPlayerStatsLoading || isTeamStatsLoading ? (
              <FullPageLoading />
            ) : (
              <>
                <TabsContent value={TEAM_SIDES.HOME_TEAM}>
                  <PlayerStatsSummaryTable
                    players={playerStats}
                    selectedPeriod={selectedPeriod}
                  />
                </TabsContent>
                <TabsContent value="team_stats">
                  <TeamStatsSummary
                    teamStats={teamStats}
                    selectedPeriod={selectedPeriod}
                  />
                </TabsContent>
                <TabsContent value={TEAM_SIDES.AWAY_TEAM}>
                  <PlayerStatsSummaryTable
                    players={playerStats}
                    selectedPeriod={selectedPeriod}
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
