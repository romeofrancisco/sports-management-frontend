import React from "react";
import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { useParams } from "react-router";

const SeasonBracketHeader = ({ seasonName, leagueName }) => {
  const { league, season } = useParams();

  return (
    <header className="border-b p-4 mb-4 grid grid-cols-2 grid-rows-2 items-center">
      <Link
        to={`/leagues/${league}/season/${season}`}
        className="flex text-muted-foreground text-xs max-w-[10rem]"
      >
        <ChevronLeft size={18} />
        Back to {leagueName}
      </Link>
      <span className="font-bold text-sm row-start-2 md:text-xl">
        {seasonName}
      </span>
    </header>
  );
};

export default SeasonBracketHeader;
