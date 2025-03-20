import React from "react";
import TeamCard from "./TeamCard";

const SportGroup = ({ sportGroup }) => {
  return (
    <>
      <h1 className="text-xl font-medium my-5">
        {sportGroup.sport}
      </h1>
      <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sportGroup.teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </>
  );
};

export default SportGroup;
