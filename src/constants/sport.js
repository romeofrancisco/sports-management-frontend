export const SPORT_STANDING_CONFIG = {
  points: {
    columns: [
      { header: "PTS", accessorKey: "standings.points" },
      { header: "PCT", accessorKey: "standings.win_percentage"},
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

