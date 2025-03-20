import React from "react";
import { useTeams } from "@/hooks/queries/useTeams";
import Loading from "@/components/Loading";
import SportGroup from "./components/SportGroup";
import PageError from "../PageError";
import TeamsListHeader from "./components/TeamsListHeader";

const TeamsList = () => {
  const { data: sportsTeams, isLoading, isError, error } = useTeams();

  if (isLoading) return <Loading />;
  if (isError) return <PageError error={error.message} />;

  return (
    <div className="h-full flex flex-col">
      <TeamsListHeader />
      {sportsTeams.length > 0 ? (
        sportsTeams?.map((sportGroup) => (
          <SportGroup key={sportGroup.sport} sportGroup={sportGroup} />
        ))
      ) : (
        <div className="flex items-center justify-center flex-grow">
          <span className="text-xl font-medium">No Teams Available</span>
        </div>
      )}
    </div>
  );
};

export default TeamsList;
