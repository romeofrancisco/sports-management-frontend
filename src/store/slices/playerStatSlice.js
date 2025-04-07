import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playerId: null,
  team: null,
  gameId: null,
  period: null,
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
    setGame(state, action) {
      state.gameId = action.payload;
    },
    setPeriod(state, action) {
      state.period = action.payload;
    },
    reset(state) {
      state.playerId = null 
      state.playerTeam = null
    }
  },
});

export const { setPlayer, setStat, setGame, setPeriod, reset } = playerStatSlice.actions;
export default playerStatSlice.reducer;
