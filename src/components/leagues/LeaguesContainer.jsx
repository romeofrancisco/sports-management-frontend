import React, { useState, useMemo } from "react";
import { useLeagues } from "@/hooks/useLeagues";
import FullPageLoading from "../common/FullPageLoading";
import PageError from "@/pages/PageError";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LeaguesHeader from "./LeaguesHeader";
import LeaguesGrid from "./LeaguesGrid";
import LeaguesEmptyState from "./LeaguesEmptyState";

const LeaguesContainer = () => {
  const { data, isLoading, isError } = useLeagues();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "list"

  const leagues = data || [];

  const filteredLeagues = useMemo(() => {
    if (!searchTerm) return leagues;
    return leagues.filter((league) =>
      league.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leagues, searchTerm]);

  if (isLoading) return <FullPageLoading />;
  if (isError) return <PageError />;

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      <CardHeader>
        <LeaguesHeader
          filteredCount={filteredLeagues.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </CardHeader>
      <CardContent>
        {filteredLeagues.length > 0 ? (
          <LeaguesGrid leagues={filteredLeagues} viewMode={viewMode} />
        ) : (
          <LeaguesEmptyState searchTerm={searchTerm} />
        )}
      </CardContent>
    </Card>
  );
};

export default LeaguesContainer;
