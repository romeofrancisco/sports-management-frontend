import React, { useState, useMemo } from "react";
import { useLeagues } from "@/hooks/useLeagues";
import FullPageLoading from "../common/FullPageLoading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LeaguesHeader from "./LeaguesHeader";
import LeaguesGrid from "./LeaguesGrid";
import LeaguesEmptyState from "./LeaguesEmptyState";
import ContentEmpty from "../common/ContentEmpty";
import { Trophy } from "lucide-react";

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
          <ContentEmpty
            icon={Trophy}
            title="No League Found"
            description={
              searchTerm
                ? `No results found for "${searchTerm}"`
                : "Create a new league to get started."
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LeaguesContainer;
