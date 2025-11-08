import React, { useState, useMemo } from "react";
import { useTournaments } from "@/hooks/useTournaments";
import FullPageLoading from "../common/FullPageLoading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TournamentsHeader from "./TournamentsHeader";
import TournamentsGrid from "./TournamentsGrid";
import TournamentsEmptyState from "./TournamentsEmptyState";

const TournamentsContainer = () => {
  const { data, isLoading, isError } = useTournaments();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "list"

  const tournaments = data?.results || data || [];

  const filteredTournaments = useMemo(() => {
    if (!searchTerm) return tournaments;
    return tournaments.filter((tournament) =>
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tournaments, searchTerm]);

  if (isLoading) return <FullPageLoading />;

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      <CardHeader>
        <TournamentsHeader
          filteredCount={filteredTournaments.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </CardHeader>
      <CardContent>
        {filteredTournaments.length > 0 ? (
          <TournamentsGrid tournaments={filteredTournaments} viewMode={viewMode} />
        ) : (
          <TournamentsEmptyState searchTerm={searchTerm} />
        )}
      </CardContent>
    </Card>
  );
};

export default TournamentsContainer;
