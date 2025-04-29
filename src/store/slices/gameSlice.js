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
        max_period,
        max_players_on_field_per_team,
        scoring_type,
      } = action.payload;
      state.game_id = id;
      state.sport = sport;
      state.league = league;
      state.season = season;
      state.home_team = home_team;
      state.away_team = away_team;
      state.home_team_score = home_team_score;
      state.away_team_score = away_team_score;
      state.current_period = current_period;
      state.max_period = max_period;
      state.max_players_on_field_per_team = max_players_on_field_per_team;
      state.scoring_type = scoring_type;
    },
  },
});

export const { setGameDetails } = gameSlice.actions;
export default gameSlice.reducer;
