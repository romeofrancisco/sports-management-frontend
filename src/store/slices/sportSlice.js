import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sport_id: null,
  name: null,
  max_players_per_team: null,
  max_players_on_field: null,
  has_period: null,
  max_period: null,
  has_tie: null,
};

const sportSlice = createSlice({
  name: "sport",
  initialState,
  reducers: {
    setSport(state, action) {
      const {
        id,
        name,
        max_players_per_team,
        max_players_on_field,
        has_period,
        max_period,
        has_tie,
      } = action.payload;
      state.sport_id = id;
      state.name = name;
      state.max_players_per_team = max_players_per_team;
      state.max_players_on_field = max_players_on_field;
      state.has_period = has_period;
      state.max_period = max_period;
      state.has_tie = has_tie;
    },
  },
});

export const { setSport } = sportSlice.actions;
export default sportSlice.reducer;
