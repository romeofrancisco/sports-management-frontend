import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    label: "Field Goal %",
    team1: 40.4,
    team2: 42.3,
  },
  {
    label: "Three Point %",
    team1: 14.9,
    team2: 29.7,
  },
  {
    label: "Turnovers",
    team1: 12,
    team2: 15,
  },
  {
    label: "Rebounds",
    team1: 54,
    team2: 37,
  },
];

const maxValues = {
  "Field Goal %": 100,
  "Three Point %": 100,
  Turnovers: 20,
  Rebounds: 60,
};

export default function TeamStatsComparison() {
  return (
    <Card className="bg-muted/50">
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">Team Stats</h2>
        <div className="grid grid-cols-3 gap-4 text-center text-sm font-medium border-t pt-4">
          <div>MIN</div>
          <div></div>
          <div>LAL</div>
        </div>

        {stats.map((stat) => {
          const max = maxValues[stat.label] || Math.max(stat.team1, stat.team2);
          const team1Percent = (stat.team1 / max) * 100;
          const team2Percent = (stat.team2 / max) * 100;

          return (
            <div
              key={stat.label}
              className="grid grid-cols-3 items-center gap-4 my-3"
            >
              <div className="text-right">
                <div className="font-bold">{stat.team1}</div>
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-blue-600 rounded"
                    style={{ width: `${team1Percent}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-xs text-center">{stat.label}</div>

              <div className="text-left">
                <div className="font-bold">{stat.team2}</div>
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-purple-600 rounded"
                    style={{ width: `${team2Percent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
