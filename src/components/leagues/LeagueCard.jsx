import React from "react";
import { useNavigate } from "react-router";
import {
  Calendar,
  Users,
  Target,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LeagueActions from "./LeagueActions";

const LeagueCard = ({ league, index, viewMode }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/leagues/${league.id}`);
  };

  if (viewMode === "list") {
    return (
      <Card
        className="group relative bg-gradient-to-r from-card/90 via-card to-card/95 shadow-lg border-2 border-primary/10 transition-all duration-500 hover:shadow-xl hover:border-primary/30 hover:scale-[1.01] overflow-hidden cursor-pointer animate-in fade-in-50"
        style={{
          animationDelay: `${index * 50}ms`,
          animationDuration: "500ms",
        }}
        onClick={handleCardClick}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>

        <CardContent className="relative p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-40 h-40 rounded-xl overflow-hidden bg-gradient-to-br from-muted/60 to-muted/40 border border-primary/10 flex-shrink-0">
                <img
                  src={league.logo}
                  alt={league.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 p-4"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                {league.name}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{league.teams_count || 0} Teams</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>{league.games_count || 0} Games</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{league.season || "Current Season"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={league.status === "active" ? "default" : "secondary"}
                className={
                  league.status === "active"
                    ? "bg-green-500/20 text-green-700 hover:bg-green-500/30"
                    : ""
                }
              >
                {league.status || "Active"}
              </Badge>
            </div>
          </div>
        </CardContent>

        <LeagueActions league={league} />
      </Card>
    );
  }

  return (
    <div
      className="group relative aspect-square animate-in fade-in-50 cursor-pointer"
      style={{ animationDelay: `${index * 100}ms`, animationDuration: "500ms" }}
      onClick={handleCardClick}
    >
      <Card className="relative h-full bg-gradient-to-br from-card/90 via-card to-card/95 shadow-lg border-2 border-primary/10 transition-all duration-500 hover:shadow-2xl hover:border-primary/30 hover:scale-[1.05] overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-secondary/8 to-transparent rounded-full blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge
            variant={league.status === "active" ? "default" : "secondary"}
            className={`text-xs ${
              league.status === "active"
                ? "bg-green-500/20 text-green-700 border-green-500/30"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {league.status || "Active"}
          </Badge>
        </div>

        <LeagueActions league={league} />

        <CardContent className="relative p-6 h-full flex flex-col">
          {/* Logo Section */}
          <div className="flex-1 flex items-center justify-center mb-4">
            <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-muted/60 to-muted/40 border-2 border-primary/10 group-hover:border-primary/30 transition-all duration-300">
              <img
                src={league.logo}
                alt={league.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 p-3"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          {/* League Info */}
          <div className="space-y-2">
            <h3 className="font-bold text-center text-foreground group-hover:text-primary transition-colors duration-300 truncate">
              {league.name}
            </h3>

            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{league.teams_count || 0}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/50"></div>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                <span>{league.games_count || 0}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeagueCard;
