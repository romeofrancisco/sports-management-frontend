import React from "react";
import { Link } from "react-router";
import { ChevronLeft, Trophy } from "lucide-react";
import { useParams } from "react-router";

const SeasonBracketHeader = ({ seasonName, leagueName }) => {
  const { league, season } = useParams();

  return (
    <header className="border-b pb-4 mb-6 flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <Link
          to={`/leagues/${league}/season/${season}`}
          className="flex items-center text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Season
        </Link>
        
        <div className="text-xs text-muted-foreground bg-muted/50 py-1 px-3 rounded-full">
          {new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-md">
            <Trophy size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-xl md:text-2xl tracking-tight">
              {seasonName}
            </h2>
            <p className="text-muted-foreground text-sm">{leagueName}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="text-xs bg-primary/10 text-primary rounded-md px-3 py-1 font-medium">
            Season in Progress
          </div>
        </div>
      </div>
    </header>
  );
};

export default SeasonBracketHeader;
