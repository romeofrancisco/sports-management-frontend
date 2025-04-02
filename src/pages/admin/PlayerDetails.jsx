import React from "react";
import { useParams } from "react-router";
import { usePlayerDetails } from "@/hooks/usePlayers";
import Loading from "@/components/common/Loading";

const PlayerDetails = () => {
  const { player } = useParams();
  const { data, isLoading } = usePlayerDetails(player);

  if (isLoading) return <Loading />;

  return <div>{data.first_name}</div>;
};

export default PlayerDetails;
