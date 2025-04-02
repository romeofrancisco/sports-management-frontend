import React from "react";
import PlayersListHeader from "./components/player/PlayersListHeader";
import { usePlayers } from "@/hooks/usePlayers";
import Loading from "@/components/common/Loading";
import { PlayersTable } from "./components/player/PlayersTable";
import PageError from "../PageError";

const PlayersList = () => {
  const { data: players, isLoading, isError } = usePlayers();

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;

  return (
    <div>
      <PlayersListHeader />
      <PlayersTable players={players} />
    </div>
  );
};

export default PlayersList;
