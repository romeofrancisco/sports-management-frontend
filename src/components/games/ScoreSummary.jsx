import React from "react";
import { cn } from "@/lib/utils";

export const ScoreSummary = ({ game, homeTeam, awayTeam }) => {
  if (!game.score_summary?.periods) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h4 className="font-semibold text-sm text-primary">Score Summary</h4>
        <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent"></div>
      </div>
      
      <div className="overflow-x-auto bg-primary/3 rounded-lg p-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-primary/15">
              <th className="text-left py-2 px-2 font-semibold text-primary">Team</th>
              {game.score_summary.periods.map((period, index) => (
                <th key={index} className="text-center py-2 px-1 font-semibold text-primary min-w-[30px]">
                  {period.label}
                </th>
              ))}
              <th className="text-center py-2 px-2 font-bold text-primary">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-primary/8">
              <td className="py-2 px-2 font-semibold text-foreground">{homeTeam.abbreviation}</td>
              {game.score_summary.periods.map((period, index) => (
                <td 
                  key={index} 
                  className={cn(
                    "text-center py-2 px-1 font-medium",
                    period.winner === homeTeam.id ? "font-bold text-primary bg-primary/8 rounded" : "text-muted-foreground"
                  )}
                >
                  {period.home}
                </td>
              ))}
              <td className="text-center py-2 px-2 font-bold text-primary bg-primary/8 rounded">
                {game.score_summary.total.home}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-2 font-semibold text-foreground">{awayTeam.abbreviation}</td>
              {game.score_summary.periods.map((period, index) => (
                <td 
                  key={index} 
                  className={cn(
                    "text-center py-2 px-1 font-medium",
                    period.winner === awayTeam.id ? "font-bold text-primary bg-primary/8 rounded" : "text-muted-foreground"
                  )}
                >
                  {period.away}
                </td>
              ))}
              <td className="text-center py-2 px-2 font-bold text-primary bg-primary/8 rounded">
                {game.score_summary.total.away}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoreSummary;
