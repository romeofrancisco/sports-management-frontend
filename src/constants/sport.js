export const SPORT_STANDING_CONFIG = {
  points: {
    columns: [
      { header: "PTS", accessorKey: "standings.points" },
      { header: "PCT", accessorKey: "standings.win_percentage" },
    ],
    sortKey: "points",
  },
  sets: {
    columns: [
      { header: "SW", accessorKey: "standings.sets_won" },
      { header: "SL", accessorKey: "standings.sets_lost" },
      { header: "SR", accessorKey: "standings.set_ratio" },
    ],
    sortKey: "set_ratio",
  },
  goals: {
    columns: [
      { header: "GF", accessorKey: "standings.points_won" },
      { header: "GA", accessorKey: "standings.points_lost" },
      { header: "GD", accessorKey: "standings.goal_difference" },
      { header: "PR", accessorKey: "standings.point_ratio" },
    ],
    sortKey: "point_ratio",
  },
};

export const STAT_TYPE = [
  { value: true, label: "Recording Stats" },
  { value: false, label: "Metrics Stats" },
];

export const CALCULATION_TYPE_VALUES = {
  NONE: "none",
  SUM: "sum",
  PERCENTAGE: "percentage",
};

export const getPeriodLabel = (sport) => {
  if (sport == "points") return "Quarter"
  if (sport == "sets") return "Set"
  return "Period"
}
