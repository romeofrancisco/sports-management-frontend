import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sport_id: null,
  name: null,
  scoring_type: null,
  slug: null,
  max_players_per_team: null,
  max_players_on_field: null,
  has_period: null,
  max_period: null,
  has_tie: null,
  has_overtime: null,
  win_threshold: null,
  win_points_threshold: null,
  win_margin: null,
};

const sportSlice = createSlice({
  name: "sport",
  initialState,
  reducers: {
    setSport(state, action) {
      const {
        id,
        name,
        scoring_type,
        slug,
        max_players_per_team,
        max_players_on_field,
        has_period,
        max_period,
        has_tie,
        has_overtime,
        win_threshold,
        win_points_threshold,
        win_margin,
      } = action.payload;
      state.sport_id = id;
      state.name = name;
      state.scoring_type = scoring_type;
      state.slug = slug;
      state.max_players_per_team = max_players_per_team;
      state.max_players_on_field = max_players_on_field;
      state.has_period = has_period;
      state.has_overtime = has_overtime;
      state.max_period = max_period;
      state.has_tie = has_tie;
      state.win_threshold = win_threshold;
      state.win_points_threshold = win_points_threshold;
      state.win_margin = win_margin;
    },
  },
});

export const { setSport } = sportSlice.actions;
export default sportSlice.reducer;
