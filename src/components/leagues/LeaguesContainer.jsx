import React, { useState, useMemo } from "react";
import { useLeagues } from "@/hooks/useLeagues";
import Loading from "@/components/common/FullLoading";
import PageError from "@/pages/PageError";
import { Card } from "@/components/ui/card";
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

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/8 to-transparent rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/8 to-transparent rounded-full blur-2xl opacity-50"></div>

      <div className="relative p-4 md:p-6">
        <LeaguesHeader
          filteredCount={filteredLeagues.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {filteredLeagues.length > 0 ? (
          <LeaguesGrid leagues={filteredLeagues} viewMode={viewMode} />
        ) : (
          <LeaguesEmptyState searchTerm={searchTerm} />
        )}
      </div>
    </Card>
  );
};

export default LeaguesContainer;
