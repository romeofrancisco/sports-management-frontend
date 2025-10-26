import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  game_id: null,
  sport: null,
  league: null,
  season: null,
  home_team: null,
  away_team: null,
  current_period: null,
  max_period: null,
  home_team_score: 0,
  away_team_score: 0,
  total_home: 0,
  total_away: 0,
  score_summary: {
    periods: [],
    current_period: 1,
    total: {
      home: 0,
      away: 0,
      difference: 0
    },
    win_threshold: 3
  },
  status: null,
  started_at: null,
  ended_at: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameDetails(state, action) {
      const {
        id,
        sport,
        league,
        season,
        home_team,
        away_team,
        home_team_score,
        away_team_score,
        total_home,
        total_away,
        score_summary,
        current_period,
        max_period,
        max_players_on_field_per_team,
        scoring_type,
        status,
        started_at,
        ended_at,
      } = action.payload;
      state.game_id = id;
      state.sport = sport;
      state.league = league;
      state.season = season;
      state.home_team = home_team;
      state.away_team = away_team;
      state.home_team_score = home_team_score;
      state.away_team_score = away_team_score;
      state.total_home = total_home;
      state.total_away = total_away;
      
      // Update score_summary if provided, otherwise keep existing structure
      if (score_summary) {
        state.score_summary = {
          ...state.score_summary,
          ...score_summary,
          total: {
            ...state.score_summary.total,
            ...score_summary.total
          }
        };
      } else {
        // Fallback to individual total values if score_summary not provided
        state.score_summary.total.home = total_home || 0;
        state.score_summary.total.away = total_away || 0;
        state.score_summary.total.difference = (total_home || 0) - (total_away || 0);
      }
      
      state.current_period = current_period;
      state.max_period = max_period;
      state.max_players_on_field_per_team = max_players_on_field_per_team;
      state.scoring_type = scoring_type;
      state.status = status;
      state.started_at = started_at;
      state.ended_at = ended_at;
    },
    updateGameScores(state, action) {
      const {
        home_team_score,
        away_team_score,
        status,
        current_period,
        score_summary,
      } = action.payload;
      
      // Only update the provided fields, preserve existing data
      if (home_team_score !== undefined) {
        state.home_team_score = home_team_score;
        state.score_summary.total.home = home_team_score;
      }
      if (away_team_score !== undefined) {
        state.away_team_score = away_team_score;
        state.score_summary.total.away = away_team_score;
      }
      
      // Update difference when scores change
      if (home_team_score !== undefined || away_team_score !== undefined) {
        state.score_summary.total.difference = state.score_summary.total.home - state.score_summary.total.away;
      }
      
      // Update score_summary if provided
      if (score_summary) {
        state.score_summary = {
          ...state.score_summary,
          ...score_summary,
          total: {
            ...state.score_summary.total,
            ...score_summary.total
          }
        };
      }
      
      if (status !== undefined) state.status = status;
      if (current_period !== undefined) {
        state.current_period = current_period;
        state.score_summary.current_period = current_period;
      }
    },
    updateGameStatus(state, action) {
      const {
        status,
        current_period,
        started_at,
        ended_at,
      } = action.payload;
      
      // Only update the provided fields, preserve existing data
      if (status !== undefined) state.status = status;
      if (current_period !== undefined) state.current_period = current_period;
      if (started_at !== undefined) state.started_at = started_at;
      if (ended_at !== undefined) state.ended_at = ended_at;
    },
    reset(state) {
      return initialState;
    },
  },
});

export const { setGameDetails, updateGameScores, updateGameStatus, reset } = gameSlice.actions;
export default gameSlice.reducer;
