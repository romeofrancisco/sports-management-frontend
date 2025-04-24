import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sport_id: null,
  name: null,
  slug: null,
  max_players_per_team: null,
  max_players_on_field: null,
  has_period: null,
  max_period: null,
  has_tie: null,
  win_threshold: null,
  set_point_threshold: null,
};

const sportSlice = createSlice({
  name: "sport",
  initialState,
  reducers: {
    setSport(state, action) {
      const {
        id,
        name,
        slug,
        max_players_per_team,
        max_players_on_field,
        has_period,
        max_period,
        has_tie,
        win_threshold,
        set_point_threshold,
      } = action.payload;
      state.sport_id = id;
      state.name = name;
      state.slug = slug;
      state.max_players_per_team = max_players_per_team;
      state.max_players_on_field = max_players_on_field;
      state.has_period = has_period;
      state.max_period = max_period;
      state.has_tie = has_tie;
      state.win_threshold = win_threshold;
      state.set_point_threshold = set_point_threshold;
    },
  },
});

export const { setSport } = sportSlice.actions;
export default sportSlice.reducer;
