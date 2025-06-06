import React from "react";
import { Link } from "react-router-dom";
import { Users, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TopTeamsCards } from "../teams";

const LeagueStandingsSection = ({ league }) => {
  return (
    <div className="animate-in fade-in-50 duration-500 delay-300">
      <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>
        
        <CardHeader className="relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
                  League Standings
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                  Current team rankings
                </CardDescription>
              </div>
            </div>
            <Link
              to={`/leagues/${league}/leaderboard`}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center transition-colors hover:scale-105 duration-200"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </CardHeader>
        
        <CardContent className="relative p-6">
          <TopTeamsCards
            league={league}
            maxTeams={3}
            gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LeagueStandingsSection;
