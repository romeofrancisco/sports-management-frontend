import React from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Award, Video } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatShortDate } from "@/utils/formatDate";
import { getSeasonYear } from "../../utils";

const GameHighlights = ({ comprehensiveStats }) => {
  const navigate = useNavigate();

  if (!comprehensiveStats) {
    return null;
  }

  const handleGameClick = (gameId) => {
    if (gameId) {
      navigate(`/games/${gameId}/game-result`);
    }
  };

  // Check if we're dealing with a set-based sport (volleyball) or point-based sport (basketball)
  const isSetBased = comprehensiveStats?.scoring_type === "sets";

  if (isSetBased) {
    return (
      <div className="animate-in fade-in-50 duration-500 delay-400">
        <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <Trophy className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Set Highlights
                  </CardTitle>
                  <CardDescription className="text-muted-foreground line-clamp-1 text-sm">
                    Most memorable moments from this league
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Highest Scoring Sets */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
                    <Trophy className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground">
                    Highest Scoring Sets
                  </h4>
                </div>
                <div className="flex-1 space-y-3">
                  {(comprehensiveStats.highest_scoring_sets || [])
                    .slice(0, 3)
                    .map((set, index) => (
                      <div
                        key={index}
                        onClick={() => handleGameClick(set.game_id)}
                        className="group relative bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-lg p-4 border border-primary/20 dark:border-primary/30 transition-all duration-300 hover:shadow-md hover:border-primary/30 dark:hover:border-primary/40 min-h-[120px] flex flex-col justify-between cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex-1 flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                              </div>
                              <span className="text-xs font-medium text-muted-foreground truncate">
                                Set {set.set_number} - {set.season} (
                                {getSeasonYear(set.start_date, set.end_date)})
                              </span>
                            </div>
                            <div className="bg-primary text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                              {set.total_score} pts
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-foreground mb-2 truncate">
                              {set.home_team} vs {set.away_team}
                            </div>
                            <div className="inline-flex items-center bg-muted/80 dark:bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                              <span className="font-bold text-lg text-foreground">
                                {set.home_score}
                              </span>
                              <span className="mx-2 text-muted-foreground">
                                -
                              </span>
                              <span className="font-bold text-lg text-foreground">
                                {set.away_score}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center justify-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                Winner: {set.winner}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                • {formatShortDate(set.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              {/* Biggest Margin Sets */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
                    <Award className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground">
                    Biggest Set Margins
                  </h4>
                </div>
                <div className="flex-1 space-y-3">
                  {(comprehensiveStats.biggest_margin_sets || [])
                    .slice(0, 3)
                    .map((set, index) => {
                      const homeScore = parseInt(set.home_score);
                      const awayScore = parseInt(set.away_score);
                      const isHomeWin = homeScore > awayScore;

                      return (
                        <div
                          key={index}
                          onClick={() => handleGameClick(set.game_id)}
                          className="group relative bg-gradient-to-r from-secondary/5 to-primary/5 dark:from-secondary/10 dark:to-primary/10 rounded-lg p-4 border border-secondary/20 dark:border-secondary/30 transition-all duration-300 hover:shadow-md hover:border-secondary/30 dark:hover:border-secondary/40 min-h-[120px] flex flex-col justify-between cursor-pointer"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex-1 flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {index + 1}
                                </div>
                                <span className="text-xs font-medium text-muted-foreground truncate">
                                  Set {set.set_number} - {set.season} (
                                  {getSeasonYear(set.start_date, set.end_date)})
                                </span>
                              </div>
                              <div className="bg-primary text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                                +{set.margin}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-semibold text-foreground mb-2 truncate">
                                {set.home_team} vs {set.away_team}
                              </div>
                              <div className="inline-flex items-center bg-muted/80 dark:bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                                <span
                                  className={`font-bold text-lg ${
                                    isHomeWin
                                      ? "text-primary"
                                      : "text-foreground"
                                  }`}
                                >
                                  {set.home_score}
                                </span>
                                <span className="mx-2 text-muted-foreground">
                                  -
                                </span>
                                <span
                                  className={`font-bold text-lg ${
                                    !isHomeWin
                                      ? "text-primary"
                                      : "text-foreground"
                                  }`}
                                >
                                  {set.away_score}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center justify-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  Winner: {set.winner}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  • {formatShortDate(set.date)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in-50 duration-500 delay-400">
      <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-xl opacity-60"></div>
        <CardHeader className="relative border-b border-border/50">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
              <Video className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-gradient">Game Highlights</span>
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Most memorable moments from this league
          </CardDescription>
        </CardHeader>
        <CardContent className="relative px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Highest Scoring Games */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
                  <Trophy className="h-4 w-4 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground">
                  Highest Scoring
                </h4>
              </div>
              <div className="flex-1 space-y-3">
                {(comprehensiveStats.highest_scoring_games || [])
                  .slice(0, 3)
                  .map((game, index) => (
                    <div
                      key={index}
                      onClick={() => handleGameClick(game.game_id)}
                      className="group relative bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-lg p-4 border border-primary/20 dark:border-primary/30 transition-all duration-300 hover:shadow-md hover:border-primary/30 dark:hover:border-primary/40 min-h-[120px] flex flex-col justify-between cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex-1 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <span className="text-xs font-medium text-muted-foreground truncate">
                              {game.season} (
                              {getSeasonYear(game.start_date, game.end_date)})
                            </span>
                          </div>
                          <div className="bg-primary text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                            {game.total_score} pts
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-foreground mb-2 truncate">
                            {game.home_team} vs {game.away_team}
                          </div>
                          <div className="inline-flex items-center bg-muted/80 dark:bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                            <span className="font-bold text-lg text-foreground">
                              {game.home_score}
                            </span>
                            <span className="mx-2 text-muted-foreground">
                              -
                            </span>
                            <span className="font-bold text-lg text-foreground">
                              {game.away_score}
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            {formatShortDate(game.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            {/* Biggest Margin Games */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
                  <Award className="h-4 w-4 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground">
                  Biggest Margins
                </h4>
              </div>
              <div className="flex-1 space-y-3">
                {(comprehensiveStats.biggest_margin_games || [])
                  .slice(0, 3)
                  .map((game, index) => {
                    const homeScore = parseInt(game.home_score);
                    const awayScore = parseInt(game.away_score);
                    const isHomeWin = homeScore > awayScore;

                    return (
                      <div
                        key={index}
                        onClick={() => handleGameClick(game.game_id)}
                        className="group relative bg-gradient-to-r from-secondary/5 to-primary/5 dark:from-secondary/10 dark:to-primary/10 rounded-lg p-4 border border-secondary/20 dark:border-secondary/30 transition-all duration-300 hover:shadow-md hover:border-secondary/30 dark:hover:border-secondary/40 min-h-[120px] flex flex-col justify-between cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex-1 flex flex-col justify-between">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                              </div>
                              <span className="text-xs font-medium text-muted-foreground truncate">
                                {game.season} (
                                {getSeasonYear(game.start_date, game.end_date)})
                              </span>
                            </div>
                            <div className="bg-primary text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                              +{game.margin}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-foreground mb-2 truncate">
                              {game.home_team} vs {game.away_team}
                            </div>
                            <div className="inline-flex items-center bg-muted/80 dark:bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                              <span
                                className={`font-bold text-lg ${
                                  isHomeWin ? "text-primary" : "text-foreground"
                                }`}
                              >
                                {game.home_score}
                              </span>
                              <span className="mx-2 text-muted-foreground">
                                -
                              </span>
                              <span
                                className={`font-bold text-lg ${
                                  !isHomeWin
                                    ? "text-primary"
                                    : "text-foreground"
                                }`}
                              >
                                {game.away_score}
                              </span>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                              {formatShortDate(game.date)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameHighlights;
