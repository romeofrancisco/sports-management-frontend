import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Columns for Highest Scoring Games table
export const highestScoringColumns = [
  {
    accessorKey: "teams",
    header: "Teams",
    cell: ({ row }) => {
      return (
        <div className="text-xs font-medium truncate max-w-[150px]">
          {row.original.home_team} vs {row.original.away_team}
        </div>
      );
    },
    size: 160
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => {
      return (
        <div className="text-xs font-medium bg-muted dark:bg-muted/50 px-2 py-0.5 rounded-md inline-flex">
          <span className="font-bold">{row.original.home_score}</span>
          <span className="mx-1 text-slate-400 dark:text-slate-500">-</span>
          <span className="font-bold">{row.original.away_score}</span>
        </div>
      );
    },
    size: 80
  },
  {
    accessorKey: "total_score",
    header: "Total",
    cell: ({ row }) => {
      return (
        <Badge 
          variant="secondary" 
          className={cn(
            "text-xs font-semibold",
            "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200",
            "dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50 dark:hover:bg-amber-900/50"
          )}
        >
          {row.original.total_score}
        </Badge>
      );
    },
    size: 60
  },
  {
    accessorKey: "season",
    header: "Season",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-muted-foreground">
          {row.original.season} ({row.original.season_year})
        </div>
      );
    },
    size: 120
  },
];

// Columns for Biggest Margins of Victory table
export const biggestMarginColumns = [
  {
    accessorKey: "teams",
    header: "Teams",
    cell: ({ row }) => {
      return (
        <div className="text-xs font-medium truncate max-w-[150px]">
          {row.original.home_team} vs {row.original.away_team}
        </div>
      );
    },
    size: 160
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => {
      const homeScore = parseInt(row.original.home_score);
      const awayScore = parseInt(row.original.away_score);
      const isHomeWin = homeScore > awayScore;
      
      return (
        <div className="text-xs font-medium bg-muted dark:bg-muted/50 px-2 py-0.5 rounded-md inline-flex">
          <span className={cn(
            isHomeWin 
              ? "font-bold text-green-600 dark:text-green-400" 
              : "font-bold text-slate-600 dark:text-slate-400"
          )}>
            {row.original.home_score}
          </span>
          <span className="mx-1 text-slate-400 dark:text-slate-500">-</span>
          <span className={cn(
            !isHomeWin 
              ? "font-bold text-green-600 dark:text-green-400" 
              : "font-bold text-slate-600 dark:text-slate-400"
          )}>
            {row.original.away_score}
          </span>
        </div>
      );
    },
    size: 80
  },
  {
    accessorKey: "margin",
    header: "Margin",
    cell: ({ row }) => {
      return (
        <Badge 
          variant="secondary" 
          className={cn(
            "text-xs font-semibold",
            "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
            "dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50 dark:hover:bg-blue-900/50"
          )}
        >
          {row.original.margin}
        </Badge>
      );
    },
    size: 60
  },
  {
    accessorKey: "season",
    header: "Season",
    cell: ({ row }) => {
      return (
        <div className="text-xs text-muted-foreground">
          {row.original.season} ({row.original.season_year})
        </div>
      );
    },
    size: 120
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-xs font-medium">{date.toLocaleDateString()}</div>
            </TooltipTrigger>
            <TooltipContent>
              {date.toLocaleDateString(undefined, { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    size: 80
  },
];
