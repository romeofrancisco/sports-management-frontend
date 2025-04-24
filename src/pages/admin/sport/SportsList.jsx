import React from "react";
import { useSports } from "@/hooks/useSports";
import Loading from "@/components/common/FullLoading";
import PageError from "@/pages/PageError";
import SportsListHeader from "./components/SportsListHeader";
import SportCard from "./components/SportCard";

const SportsList = () => {
  const { data: sports, isLoading, isError } = useSports();

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;

  return (
    <div>
      <SportsListHeader />
      <div className="border md:bg-muted/30 pt-5 md:p-5 lg:p-8 my-5 rounded-lg min-h-[calc(100vh-10.5rem)]">
        <div className="grid gap-5 lg:grid-cols-4 md:grid-cols-2">
          {sports.map((sport) => (
            <SportCard sport={sport} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SportsList;
