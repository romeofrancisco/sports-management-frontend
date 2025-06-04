export const GAME_STATUS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "postponed", label: "Postponed" },
];

export const GAME_TYPES = [
  { value: "practice", label: "Practice Game" },
  { value: "league", label: "League" },
  { value: "tournament", label: "Tournament" },
];

export const GAME_TYPE_VALUES = {
  PRACTICE: "practice",
  LEAGUE: "league",
  TOURNAMENT: "tournament"
};

export const GAME_STATUS_VALUES = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  POSTPONED: "postponed"
}



export const TEAM_SIDES = {
  HOME_TEAM: "home_team",
  AWAY_TEAM: "away_team",
};

export const GAME_ACTIONS = {
  START: "start",
  COMPLETE: "complete",
  POSTPONE: "postpone",
  NEXT_PERIOD: "next_period",
};
