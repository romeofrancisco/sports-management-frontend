import React from "react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import {
  useTournamentDetails,
  useTournamentStandings,
} from "@/hooks/useTournaments";
import PageError from "@/pages/PageError";
import FullPageLoading from "@/components/common/FullPageLoading";
import { useParams, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Trophy, Users, BarChart3, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import TournamentOverview from "./components/TournamentOverview";
import TournamentStandings from "./components/TournamentStandings";
import TournamentTeams from "./components/TournamentTeams";
import TournamentStatistics from "./components/TournamentStatistics";
import TournamentGames from "./components/TournamentGames";
import TournamentBracket from "./components/TournamentBracket";
import TournamentActions from "./components/TournamentActions";

const TournamentDetails = () => {
  const { tournamentId } = useParams();
  const location = useLocation();
  const { isAdmin } = useRolePermissions();
  
  // Get current page from URL path
  const currentPath = location.pathname;
  
  const getCurrentPage = () => {
    if (currentPath.includes("/standings")) return "standings";
    if (currentPath.includes("/games")) return "games";
    if (currentPath.includes("/teams")) return "teams";
    if (currentPath.includes("/statistics")) return "statistics";
    if (currentPath.includes("/bracket")) return "bracket";
    return "overview"; // default to overview
  };

  const currentPage = getCurrentPage();

  const {
    data: tournamentDetails,
    isLoading: isTournamentLoading,
    isError: isTournamentError,
  } = useTournamentDetails(tournamentId);

  const {
    data: standings,
    isLoading: isStandingsLoading,
    isError: isStandingsError,
  } = useTournamentStandings(tournamentId);

  const isLoading = isTournamentLoading || isStandingsLoading;
  const isError = isTournamentError || isStandingsError;

  if (isLoading) return <FullPageLoading />;
  if (isError) return <PageError />;

  const { name, sport } = tournamentDetails;

  // Status badge color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300";
      case "upcoming":
        return "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300";
      case "completed":
        return "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300";
      case "canceled":
        return "bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-300";
      case "paused":
        return "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const titleWithBadge = (
    <div className="flex items-center gap-3">
      <span>{tournamentDetails?.name || "Tournament"}</span>
      {tournamentDetails?.status && (
        <Badge
          variant="outline"
          className={`capitalize ${getStatusColor(tournamentDetails.status)}`}
        >
          {tournamentDetails.status}
        </Badge>
      )}
    </div>
  );

  // Navigation items for the tournament details
  const navigationItems = [
    {
      key: "overview",
      label: "Overview",
      path: `/tournaments/${tournamentId}`,
      description: "Tournament overview and summary",
      icon: Trophy,
    },
    {
      key: "standings",
      label: "Standings",
      path: `/tournaments/${tournamentId}/standings`,
      description: "Team standings and rankings",
      icon: BarChart3,
    },
    {
      key: "games",
      label: "Games",
      path: `/tournaments/${tournamentId}/games`,
      description: "All games in this tournament",
      icon: Target,
    },
    {
      key: "teams",
      label: "Teams",
      path: `/tournaments/${tournamentId}/teams`,
      description: "All teams in this tournament",
      icon: Users,
    },
    {
      key: "bracket",
      label: "Bracket",
      path: `/tournaments/${tournamentId}/bracket`,
      description: "Tournament bracket",
      icon: Trophy,
    },
  ];

  // Render content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case "overview":
        return (
          <TournamentOverview
            tournament={tournamentDetails}
            standings={standings}
          />
        );
      case "standings":
        return <TournamentStandings standings={standings} tournament={tournamentDetails} />;
      case "games":
        return <TournamentGames tournamentId={tournamentId} />;
      case "teams":
        return <TournamentTeams tournament={tournamentDetails} />;
      case "statistics":
        return <TournamentStatistics tournamentId={tournamentId} />;
      case "bracket":
        return <TournamentBracket tournament={tournamentDetails} />;
      default:
        return (
          <TournamentOverview
            tournament={tournamentDetails}
            standings={standings}
          />
        );
    }
  };

  return (
    <div className="p-3 md:p-6">
      <UniversityPageHeader
        title={titleWithBadge}
        subtitle={`${sport?.name} Tournament`}
        description="Manage tournament details, games, and statistics"
        showBackButton={true}
        backButtonText="Back to Tournaments"
        backButtonPath="/tournaments"
      >
        {isAdmin() && tournamentDetails.status !== "completed" && (
          <TournamentActions tournament={tournamentDetails} />
        )}
      </UniversityPageHeader>

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

export default TournamentDetails;
