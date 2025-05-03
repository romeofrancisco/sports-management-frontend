import React, { useState } from "react";
import { useSelector } from "react-redux";
import { SCORING_TYPE_VALUES } from "@/constants/sport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TeamStatsSummary = ({ teamStats }) => {
  const { home_team, away_team } = useSelector((state) => state.game);
  const { home_team: homeStats, away_team: awayStats } = teamStats || {};
  const { scoring_type } = useSelector((state) => state.sport);
  const [selectedPeriod, setSelectedPeriod] = useState("total");

  // Get stat names in order provided by backend
  const statNames = homeStats?.total_stats
    ? Object.keys(homeStats.total_stats)
    : [];

  // Get available periods from homeStats
  const availablePeriods =
    homeStats?.periods?.map((period) => ({
      value: period.period,
      label: `Set ${period.period}`,
    })) || [];

  // Helper to format the stat value based on its type
  const formatStat = (value) => {
    if (typeof value === "string" && value.includes("/")) {
      return value;
    }
    if (typeof value === "number") {
      if (Number.isInteger(value)) {
        return value;
      }
      return value;
    }
    return value;
  };

  // Get the selected period data
  const getSelectedPeriodData = () => {
    if (!selectedPeriod) return null;

    const homePeriod = homeStats?.periods?.find(
      (p) => p.period === selectedPeriod
    );
    const awayPeriod = awayStats?.periods?.find(
      (p) => p.period === selectedPeriod
    );

    return { homePeriod, awayPeriod };
  };

  const periodData = getSelectedPeriodData();

  return (
    <div className="flex flex-col gap-4 text-xs lg:mx-[10rem] lg:text-sm py-4 border-y my-2">
      {/* Teams Header */}
      {/* Period Selector for Set-Based Sports */}
      {scoring_type === SCORING_TYPE_VALUES.SETS &&
        availablePeriods.length > 0 && (
          <div className="flex justify-end items-center border-b pb-2">
            <Select
              value={selectedPeriod?.toString()}
              onValueChange={(value) =>
                setSelectedPeriod(value === "total" ? "total" : parseInt(value))
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
      <div className="grid grid-cols-3 text-center items-center">
        <div className="font-bold flex items-center justify-start gap-2">
          <img src={home_team.logo} alt={home_team.name} className="w-12" />
          <span className="text-start">{home_team.abbreviation}</span>
        </div>
        <div className="font-extrabold text-lg tracking-wide">TEAM STATS </div>
        <div className="font-bold flex items-center justify-end gap-2">
          <span className="text-end">{away_team.abbreviation}</span>
          <img src={away_team.logo} alt={away_team.name} className="w-12" />
        </div>
      </div>

      {/* Stats - Show total stats when no period is selected or "total" is selected */}
      {(!selectedPeriod || selectedPeriod === "total") && (
        <div className="overflow-hidden ">
          {statNames.map((statName, idx) => (
            <div
              key={statName}
              className={`grid grid-cols-3 text-center items-center py-2 px-2 ${
                idx % 2 === 0 ? "bg-muted/30" : "bg-background"
              } hover:bg-muted/50 transition-all duration-200`}
            >
              <div className="text-start ps-2">
                {formatStat(homeStats?.total_stats[statName])}
              </div>
              <div className="">{statName}</div>
              <div className="text-end pe-2">
                {formatStat(awayStats?.total_stats[statName])}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Period Stats */}
      {scoring_type === SCORING_TYPE_VALUES.SETS &&
        selectedPeriod &&
        selectedPeriod !== "total" &&
        periodData && (
          <div className="overflow-hidden">
            <div className="grid grid-cols-3 text-center items-center py-2 px-2 bg-muted/30">
              <div className="text-start ps-2">
                {periodData.homePeriod?.points || 0}
              </div>
              <div className="text-base font-medium">Points</div>
              <div className="text-end pe-2">
                {periodData.awayPeriod?.points || 0}
              </div>
            </div>
            {periodData.homePeriod &&
              Object.entries(periodData.homePeriod.stats).map(
                ([statName, value], idx) => (
                  <div
                    key={statName}
                    className={`grid grid-cols-3 text-center items-center py-2 px-2 ${
                      (idx + 1) % 2 === 0 ? "bg-muted/30" : "bg-background"
                    } hover:bg-muted/50 transition-all duration-200`}
                  >
                    <div className="text-start ps-2">{formatStat(value)}</div>
                    <div className="text-base font-medium">{statName}</div>
                    <div className="text-end pe-2">
                      {formatStat(periodData.awayPeriod?.stats[statName])}
                    </div>
                  </div>
                )
              )}
          </div>
        )}
    </div>
  );
};

export default TeamStatsSummary;
