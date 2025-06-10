export const SESSION_ROUTES = {
  ATTENDANCE: (sessionId) => `/sessions/${sessionId}/manage/attendance`,
  SESSION_METRICS: (sessionId) => `/sessions/${sessionId}/manage/session-metrics`,
  PLAYER_METRICS: (sessionId) => `/sessions/${sessionId}/manage/player-metrics`,
  RECORD_METRICS: (sessionId) => `/sessions/${sessionId}/manage/record-metrics`,
};

export const WORKFLOW_STEP_IDS = {
  ATTENDANCE: "attendance",
  SESSION_METRICS: "session-metrics",
  PLAYER_METRICS: "player-metrics",
  RECORD_METRICS: "record-metrics",
};

export const SESSION_STATUS = {
  UPCOMING: "upcoming",
  ONGOING: "ongoing",
  COMPLETED: "completed",
};
