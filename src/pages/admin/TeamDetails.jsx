import React from "react";
import { useParams } from "react-router";
import { useTeamDetails } from "@/hooks/useTeams";
import Loading from "@/components/common/Loading";

const TeamDetails = () => {
  const { team } = useParams();
  const { data, isLoading } = useTeamDetails(team);

  if (isLoading) return <Loading />;



  return (
  <div>{data.name}</div>);
};

export default TeamDetails;
