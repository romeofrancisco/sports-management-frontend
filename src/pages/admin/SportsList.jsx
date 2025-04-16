import React from "react";
import { useSports } from "@/hooks/useSports";
import Loading from "@/components/common/FullLoading";
import PageError from "../PageError";

const SportsList = () => {
  const { data: sports, isLoading, isError, refetch } = useSports();

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;

  return (
    <div className="grid gap-5 lg:grid-cols-4 md:grid-cols-2">
      {sports.map((sport) => (
        <div className="aspect-video bg-muted/50 rounded-xl text-center content-center">
          {sport.name}
        </div>
      ))}
    </div>
  );
};

export default SportsList;
