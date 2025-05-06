import React from "react";
import TeamCard from "./TeamCard";
import { useTeamForm } from "@/hooks/useLeagues";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { useParams } from "react-router";

const LeagueTeamsGrid = ({ teams }) => {
  const navigate = useNavigate();
  const { league } = useParams();
  const { data: teamFormData, isLoading: isFormLoading } = useTeamForm(league);
  
  if (isFormLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <div className="mt-3 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-16" />
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <Skeleton key={j} className="w-2.5 h-2.5 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No teams in this league</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      {teams.map((team) => (
        <TeamCard 
          key={team.team_id} 
          team={team} 
          formData={teamFormData?.form?.[team.team_id] || []}
          onClick={() => navigate(`/teams/${team.team_slug}`)}
        />
      ))}
    </div>
  );
};

export default LeagueTeamsGrid;