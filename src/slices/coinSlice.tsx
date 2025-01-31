import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkUserDetails } from "../services/auth/auth";

interface CoinState {
  coins: number;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: CoinState = {
  coins: 0,
  loading: false,
  error: null,
};

// Async Thunk to Fetch Coins
export const fetchCoins = createAsyncThunk("coins/fetchCoins", async () => {
  const response = await checkUserDetails();
  return response.data?.points || 0;
});

//
const coinSlice = createSlice({
  name: "coin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.loading = false;
        state.coins = action.payload;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch coins";
      });
  },
});

export default coinSlice.reducer;
