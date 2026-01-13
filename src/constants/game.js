export const GAME_STATUS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "postponed", label: "Postponed" },
  { value: "default_home_win", label: "Default Win (Home)" },
  { value: "default_away_win", label: "Default Win (Away)" },
  { value: "double_default", label: "Double Default" },
  { value: "forfeited", label: "Forfeited" },
];

export const GAME_TYPES = [
  { value: "practice", label: "Practice Game" },
  { value: "league", label: "League" },
  { value: "tournament", label: "Tournament" },
];

export const GAME_TYPE_VALUES = {
  PRACTICE: "practice",
  LEAGUE: "league",
  // TOURNAMENT: "tournament"
};

export const GAME_STATUS_VALUES = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  POSTPONED: "postponed",
  DEFAULT_HOME_WIN: "default_home_win",
  DEFAULT_AWAY_WIN: "default_away_win",
  DOUBLE_DEFAULT: "double_default",
  FORFEITED: "forfeited",
};

// Helper to check if a game status is "finished" (counts in standings)
export const isGameFinished = (status) => {
  return [
    GAME_STATUS_VALUES.COMPLETED,
    GAME_STATUS_VALUES.DEFAULT_HOME_WIN,
    GAME_STATUS_VALUES.DEFAULT_AWAY_WIN,
    GAME_STATUS_VALUES.DOUBLE_DEFAULT,
    GAME_STATUS_VALUES.FORFEITED,
  ].includes(status);
};

export const TEAM_SIDES = {
  HOME_TEAM: "home_team",
  AWAY_TEAM: "away_team",
};

export const GAME_ACTIONS = {
  START: "start",
  COMPLETE: "complete",
  POSTPONE: "postpone",
  NEXT_PERIOD: "next_period",
  DEFAULT_HOME_WIN: "default_home_win",
  DEFAULT_AWAY_WIN: "default_away_win",
  DOUBLE_DEFAULT: "double_default",
  FORFEIT: "forfeit",
};
