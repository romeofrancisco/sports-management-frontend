import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playerId: null,
  team: null,
};

const playerStatSlice = createSlice({
  name: "playerStat",
  initialState,
  reducers: {
    setPlayer(state, action) {
      const { id, team } = action.payload
      state.playerId = id
      state.team = team
    },
    reset(state) {
      state.playerId = null 
      state.playerTeam = null
    }
  },
});

export const { setPlayer, reset } = playerStatSlice.actions;
export default playerStatSlice.reducer;
