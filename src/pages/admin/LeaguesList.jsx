import React from "react";
import LeaguesListHeader from "./components/league/LeaguesListHeader";
import { useLeagues } from "@/hooks/useLeagues";
import Loading from "@/components/common/Loading";
import PageError from "../PageError";
import LeaguesTable from "./components/league/LeaguesTable";

const LeaguesList = () => {
  const { data, isLoading, isError } = useLeagues();

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;

  return (
    <div>
      <LeaguesListHeader />
      <LeaguesTable leagues={data} />
    </div>
  );
};

export default LeaguesList;
