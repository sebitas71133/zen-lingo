import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const wordSlice = createSlice({
  name: "word",
  initialState,
  reducers: {},
});

export const {} = wordSlice.actions;

export const wordReducer = wordSlice.reducer;
