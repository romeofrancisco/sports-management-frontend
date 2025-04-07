import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  sport: null,
  league: null,
  season: null,
  home_team: null,
  away_team: null,
  current_period: null,
  home_team_score: 0,
  away_team_score: 0,
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
        current_period,
      } = action.payload;
      state.id = id
      state.sport = sport;
      state.league = league;
      state.season = season;
      state.home_team = home_team;
      state.away_team = away_team;
      state.home_team_score = home_team_score;
      state.away_team_score = away_team_score;
      state.current_period = current_period;
    },
    incrementPeriod(state) {
      state.current_period = Number(state.current_period) + 1
    },
    incrementHomeScore(state, action) {
      state.home_team_score += action.payload;
    },
    decrementHomeScore(state, action) {
      state.home_team_score -= action.payload;
    },
    incrementAwayScore(state, action) {
      state.away_team_score += action.payload;
    },
    decrementAwayScore(state, action) {
      state.away_team_score -= action.payload;
    },
  },
});

export const {
  setGameDetails,
  incrementPeriod,
  incrementHomeScore,
  decrementHomeScore,
  incrementAwayScore,
  decrementAwayScore,
} = gameSlice.actions;
export default gameSlice.reducer;
