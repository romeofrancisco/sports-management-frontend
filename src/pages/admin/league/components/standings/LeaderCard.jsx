import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Target, Activity, Shield, Star } from "lucide-react";
import InfoCard from "@/components/common/InfoCard";

/**
 * LeaderCard - Enhanced card component for displaying top league leaders
 * Used for the top leader (#1 player) with rich visual presentation
 */
export const LeaderCard = ({ player, stats, rank, isLeader = false }) => {
  const { statCodes, mainStat, additionalStats, icon } = useLeaderData(
    player,
    stats,
    rank
  );

  if (isLeader) {
    // Special leader display for #1 player
    return (
      <TopLeaderCard
        player={player}
        stats={stats}
        mainStat={mainStat}
        additionalStats={additionalStats}
        icon={icon}
      />
    );
  }

  // Fallback to simpler card for other cases
  return <SimpleLeaderCard player={player} stats={stats} rank={rank} />;
};

/**
 * Custom hook to process leader data and determine appropriate styling
 */
const useLeaderData = (player, stats, rank) => {
  const statCodes = Object.keys(player.stats).slice(0, 4);
  const mainStatCode = statCodes[0];
  const mainStat = stats.find((s) => s.code === mainStatCode);

  // Format additional stats for display
  const additionalStats = statCodes
    .slice(1)
    .map((code) => {
      const stat = stats.find((s) => s.code === code);
      return `${stat?.display_name || code}: ${player.stats[code]}`;
    })
    .join(" | ");

  // Dynamic icon selection based on rank and stat category
  const icon = getStatIcon(rank, mainStat?.category);

  return { statCodes, mainStat, additionalStats, icon };
};

/**
 * Player information component with avatar and stats
 */
const PlayerInfo = ({ player, additionalStats }) => (
  <div className="flex items-center gap-2">
    <Avatar className="h-6 w-6 border border-primary/20 shadow-sm">
      <AvatarImage src={player.profile} alt={player.player_name} />
      <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
        {getPlayerInitials(player.player_name)}
      </AvatarFallback>
    </Avatar>
    <div className="flex flex-col">
      <span className="text-xs font-medium text-foreground">
        {player.player_name}
      </span>
      {additionalStats && (
        <span className="text-[10px] text-muted-foreground line-clamp-1">
          {additionalStats}
        </span>
      )}
    </div>
  </div>
);

/**
 * TopLeaderCard for the #1 leader with prominent display
 */
const TopLeaderCard = ({ player, stats, mainStat, additionalStats, icon }) => {
  const statCodes = Object.keys(player.stats);
  const primaryStatValue = player.stats[statCodes[0]];

  return (
    <div className="relative overflow-hidden rounded-lg border-2 border-secondary/50 bg-gradient-to-br from-secondary/10 via-primary/5 to-secondary/5 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Main content */}
      <div className="relative">
        {/* Header with trophy and title */}
        <div className="flex items-center justify-between mb-4">
          {" "}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-3 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 group-hover:rotate-3">
                <Trophy className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold border-2 border-background">
                1
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Leader</h3>
              <p className="text-sm text-muted-foreground">
                {mainStat?.display_name || statCodes[0]}
              </p>
            </div>
          </div>
          {/* Main stat value */}
          <div className="text-right">
            <div className="text-3xl font-bold text-secondary">
              {primaryStatValue}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              {mainStat?.unit || "TOTAL"}
            </div>
          </div>
        </div>

        {/* Player information */}
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12 border-3 border-secondary/30 shadow-md">
            <AvatarImage src={player.profile} alt={player.player_name} />
            <AvatarFallback className="text-base bg-secondary/20 text-secondary font-bold">
              {getPlayerInitials(player.player_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h4 className="text-lg font-semibold text-foreground">
              {player.player_name}
            </h4>
            {player.team_name && (
              <p className="text-sm text-muted-foreground">
                {player.team_name}
              </p>
            )}
          </div>
        </div>

        {/* Enhanced additional stats */}
        {additionalStats && (
          <div className="bg-gradient-to-r from-secondary/5 to-primary/5 rounded-lg p-4 border border-secondary/20 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-secondary/60"></div>
              <h5 className="text-sm font-semibold text-foreground">
                Performance Overview
              </h5>
            </div>
            <div className="flex gap-2">
              {additionalStats.split(" | ").map((stat, index) => {
                const [name, value] = stat.split(": ");
                return (
                  <div
                    key={index}
                    className="text-center p-2 w-full bg-background/50 rounded border border-border/30"
                  >
                    <div className="text-xs text-muted-foreground font-medium">
                      {name}
                    </div>
                    <div className="text-sm font-bold text-foreground">
                      {value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Simplified card for non-top leaders
 */
const SimpleLeaderCard = ({ player, stats, rank }) => {
  const statCodes = Object.keys(player.stats).slice(0, 2);
  const mainStat = stats.find((s) => s.code === statCodes[0]);

  return (
    <div className="p-3 border border-border/30 rounded-lg bg-gradient-to-r from-muted/10 to-transparent hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
          {rank}
        </div>

        <Avatar className="h-8 w-8 border border-primary/20">
          <AvatarImage src={player.profile} alt={player.player_name} />
          <AvatarFallback className="text-xs bg-primary/10 text-primary">
            {getPlayerInitials(player.player_name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="text-sm font-medium text-foreground">
            {player.short_name || player.player_name}
          </div>
          <div className="text-xs text-muted-foreground">
            {mainStat?.display_name}: {player.stats[statCodes[0]]}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Utility Functions
 */

// Get appropriate icon based on rank and stat category
const getStatIcon = (rank, category) => {
  if (rank === 1) {
    return <Trophy className="h-5 w-5 text-secondary" />;
  }

  switch (category) {
    case "scoring":
      return <Target className="h-5 w-5 text-primary/80" />;
    case "defensive":
      return <Shield className="h-5 w-5 text-primary/70" />;
    case "offensive":
      return <Activity className="h-5 w-5 text-secondary/80" />;
    default:
      return <Star className="h-5 w-5 text-primary/60" />;
  }
};

// Get styling classes based on rank
const getCardStyling = (rank) => {
  const baseClasses = "hover:shadow-md transition-all duration-300 border-l-4";

  if (rank === 1) {
    return `${baseClasses} border-l-secondary bg-gradient-to-r from-secondary/5 to-transparent`;
  }

  return `${baseClasses} border-l-primary/60 bg-gradient-to-r from-primary/3 to-transparent`;
};

// Extract player initials safely
const getPlayerInitials = (playerName) => {
  if (!playerName) return "?";

  return playerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

export default LeaderCard;
