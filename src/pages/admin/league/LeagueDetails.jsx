import React from "react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import { useLeagueDetails, useLeagueRankings } from "@/hooks/useLeagues";
import FullPageLoading from "@/components/common/FullPageLoading";
import { useParams, Link, useLocation } from "react-router-dom";
import LeagueSeasons from "./components/seasons/LeagueSeasons";
import LeagueStandings from "./components/standings/LeagueStandings";
import { useSeasons } from "@/hooks/useSeasons";
import LeagueTeamsGrid from "./components/teams/LeagueTeamsGrid";
import { LeagueOverview } from "./components/overview";
import { cn } from "@/lib/utils";
import { Trophy, Users, Calendar } from "lucide-react";

const LeagueDetails = () => {
  const { league } = useParams();
  const location = useLocation();
  // Get current page from URL path
  const currentPath = location.pathname;  const getCurrentPage = () => {
    if (currentPath.includes("/teams")) return "teams";
    if (currentPath.includes("/seasons")) return "seasons";
    if (currentPath.includes("/leaderboard")) return "leaderboard";
    return "overview"; // default to overview
  };

  const currentPage = getCurrentPage();  const {
    data: leagueDetails,
    isLoading: isLeagueLoading,
    isError: isLeagueError,
  } = useLeagueDetails(league);
  const {
    data: leagueRankings,
    isLoading: isLeagueRankingsLoading,
    isError: isLeagueRankingsError,
  } = useLeagueRankings(league);
  const {
    data: seasonsData,
    isLoading: isSeasonsLoading,
    isError: isSeasonsError,
  } = useSeasons(league);

  // Extract seasons results from the paginated data
  const seasons = seasonsData?.results || [];

  const isLoading =
    isLeagueLoading || isSeasonsLoading || isLeagueRankingsLoading;
  const isError = isLeagueError || isSeasonsError || isLeagueRankingsError;

  if (isLoading) return <FullPageLoading />;

  const { name, sport } = leagueDetails;
  // Navigation items for the league details
  const navigationItems = [
    {
      key: "overview",
      label: "Overview",
      path: `/leagues/${league}`,
      description: "League overview and summary",
      icon: Trophy,
    },
    {
      key: "leaderboard",
      label: "Leaderboard",
      path: `/leagues/${league}/leaderboard`,
      description: "Team standings and rankings",
      icon: Trophy,
    },
    {
      key: "teams",
      label: "Teams",
      path: `/leagues/${league}/teams`,
      description: "All teams in this league",
      icon: Users,
    },
    {
      key: "seasons",
      label: "Seasons",
      path: `/leagues/${league}/seasons`,
      description: "Season history and details",
      icon: Calendar,
    },
  ];  // Render content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case "overview":
        return <LeagueOverview league={league} sport={sport} />;
      case "leaderboard":
        return <LeagueStandings rankings={leagueRankings} />;
      case "teams":
        return <LeagueTeamsGrid />;
      case "seasons":
        return <LeagueSeasons league={leagueDetails} seasons={seasons} sport={sport} />;
      default:
        return <LeagueOverview league={league} sport={sport} />;
    }
  };
  return (
    <div className="container mx-auto p-1 md:p-6 space-y-6">
      <UniversityPageHeader
        title={name}
        subtitle={`${sport.name} League`}
        description="Manage league details, teams, and statistics"
        showBackButton={true}
        backButtonText="Back to Leagues"
        backButtonPath="/leagues"
      />

      {/* Navigation Links */}
      <div className="my-4">
        <nav className="border-b border-border">
          <div className="flex space-x-3 overflow-x-auto">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  className={cn(
                    "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200",
                    currentPage === item.key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  <IconComponent
                    className={cn(
                      "mr-2 h-4 w-4 transition-colors duration-200",
                      currentPage === item.key
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default LeagueDetails;
