import React from "react";
import { useTeams } from "@/hooks/queries/useTeams";
import TeamsListHeader from "./components/team/TeamsListHeader";
import Loading from "@/components/common/Loading";
import PageError from "../PageError";
import TeamTable from "./components/team/TeamTable";

const TeamsList = () => {
  const { data: teams, isLoading, isError } = useTeams();

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;

  return (
    <div>
      <TeamsListHeader />
      <TeamTable teams={teams} />
    </div>
  );
};

export default TeamsList;
